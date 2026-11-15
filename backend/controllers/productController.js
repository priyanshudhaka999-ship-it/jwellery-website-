const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const { logAdminActivity } = require('../utils/activityLogger');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      collection,
      metalType,
      occasion,
      stone,
      minPrice,
      maxPrice,
      search,
      featured,
      newArrival,
      bestseller,
      includeInactive,
      demoOnly,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }
    if (demoOnly === 'true') {
      filter.isDemoProduct = true;
    }
    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, ...(category.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: category }] : [])],
      });
      if (catDoc) filter.category = catDoc._id;
    }
    if (collection && collection.match(/^[0-9a-fA-F]{24}$/)) {
      filter.collectionRef = collection;
    }
    if (metalType) filter.metalType = metalType;
    if (occasion) filter.occasion = occasion;
    if (stone) filter.stoneDetails = { $regex: stone, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;
    if (newArrival === 'true') filter.isNewArrival = true;
    if (bestseller === 'true') filter.isBestseller = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { sku: regex },
        { shortDescription: regex },
        { stoneDetails: regex },
        { metalType: regex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { viewsCount: -1, enquiriesCount: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('collectionRef', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:idOrSlug
exports.getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug.toLowerCase() }] }
      : { slug: idOrSlug.toLowerCase() };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate('collectionRef', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Jewellery piece not found in the AARANYA catalogue.',
      });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category?._id,
      isActive: true,
    })
      .limit(4)
      .select('name slug sku price originalPrice metalType purity images isDemoProduct availability');

    res.json({
      success: true,
      product,
      similarProducts,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Protected Admin + Multer multi-image upload)
exports.createProduct = async (req, res, next) => {
  const uploadedCloudinaryIds = [];
  try {
    const body = req.body;
    const slug = body.slug
      ? slugify(body.slug, { lower: true, strict: true })
      : slugify(`${body.name || ''}-${body.sku || ''}`, { lower: true, strict: true });

    let images = [];

    // 1. Handle uploaded binary files via Cloudinary
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploaded = await uploadBufferToCloudinary(req.files[i].buffer, 'aaranya/products');
        uploadedCloudinaryIds.push(uploaded.publicId);
        images.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          width: uploaded.width,
          height: uploaded.height,
          alt: body.imageAlts?.[i] || `${body.name} - View ${i + 1}`,
          isMain: i === 0,
          order: i,
          isDemo: false,
          licenseSource: 'Actual Store Photography',
        });
      }
    } else if (body.images) {
      images = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
    }

    const product = await Product.create({
      ...body,
      slug,
      sizes: typeof body.sizes === 'string' ? JSON.parse(body.sizes) : body.sizes || [],
      specifications:
        typeof body.specifications === 'string'
          ? JSON.parse(body.specifications)
          : body.specifications || [],
      images,
      isDemoProduct: images.some((img) => img.isDemo === true),
    });

    await logAdminActivity(
      req.admin,
      'Product created',
      `${product.name} (${product.sku})`,
      `Created at INR ${product.price}`
    );

    res.status(201).json({ success: true, product });
  } catch (error) {
    // Cleanup any uploaded Cloudinary images if DB creation fails
    for (const pubId of uploadedCloudinaryIds) {
      await deleteFromCloudinary(pubId);
    }
    next(error);
  }
};

// PUT /api/products/:id (Protected Admin — supports price tracking, image replacement & reordering)
exports.updateProduct = async (req, res, next) => {
  const newlyUploadedIds = [];
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const oldPrice = product.price;
    const oldCategory = String(product.category);
    const body = req.body;

    // Upload any new binary files to Cloudinary
    const newImages = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploaded = await uploadBufferToCloudinary(req.files[i].buffer, 'aaranya/products');
        newlyUploadedIds.push(uploaded.publicId);
        newImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          width: uploaded.width,
          height: uploaded.height,
          alt: body.newImageAlts?.[i] || `${body.name || product.name} - Authentic Store Photo`,
          isMain: false,
          order: product.images.length + i,
          isDemo: false,
          licenseSource: 'Actual Store Photography',
        });
      }
    }

    // Handle retained / reordered / replaced images
    let updatedGallery = product.images;
    if (body.images) {
      const parsedImages = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
      const retainedPublicIds = new Set(parsedImages.map((img) => img.publicId).filter(Boolean));
      for (const existingImg of product.images) {
        if (existingImg.publicId && !retainedPublicIds.has(existingImg.publicId)) {
          await deleteFromCloudinary(existingImg.publicId);
        }
      }
      updatedGallery = [...parsedImages, ...newImages];
    } else if (newImages.length > 0) {
      updatedGallery = [...product.images, ...newImages];
    }

    // Ensure exactly one main image
    if (updatedGallery.length > 0 && !updatedGallery.some((img) => img.isMain)) {
      updatedGallery[0].isMain = true;
    }

    Object.assign(product, {
      ...body,
      images: updatedGallery,
      sizes: body.sizes
        ? typeof body.sizes === 'string'
          ? JSON.parse(body.sizes)
          : body.sizes
        : product.sizes,
      specifications: body.specifications
        ? typeof body.specifications === 'string'
          ? JSON.parse(body.specifications)
          : body.specifications
        : product.specifications,
      isDemoProduct: updatedGallery.some((img) => img.isDemo === true),
    });

    await product.save();

    if (Number(body.price) && Number(body.price) !== oldPrice) {
      await logAdminActivity(
        req.admin,
        'Price changed',
        `${product.name} (${product.sku})`,
        `INR ${oldPrice} -> INR ${product.price}`
      );
    } else if (newImages.length > 0 || body.imageReplaced) {
      await logAdminActivity(
        req.admin,
        'Image replaced',
        `${product.name} (${product.sku})`,
        'Updated product gallery images'
      );
    } else if (body.category && String(body.category) !== oldCategory) {
      await logAdminActivity(
        req.admin,
        'Category changed',
        `${product.name} (${product.sku})`,
        `Assigned new category ID ${body.category}`
      );
    } else {
      await logAdminActivity(
        req.admin,
        'Product updated',
        `${product.name} (${product.sku})`,
        'Updated product attributes'
      );
    }

    res.json({ success: true, product });
  } catch (error) {
    for (const pubId of newlyUploadedIds) {
      await deleteFromCloudinary(pubId);
    }
    next(error);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    for (const img of product.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await product.deleteOne();
    await logAdminActivity(
      req.admin,
      'Product deleted',
      `${product.name} (${product.sku})`,
      'Permanently removed product and associated Cloudinary assets'
    );

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

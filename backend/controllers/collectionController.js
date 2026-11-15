const slugify = require('slugify');
const Collection = require('../models/Collection');
const { logAdminActivity } = require('../utils/activityLogger');

exports.getCollections = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isVisible: true };
    const collections = await Collection.find(filter)
      .populate('products', 'name slug sku price originalPrice images metalType purity')
      .sort({ displayOrder: 1 });
    res.json({ success: true, collections });
  } catch (err) {
    next(err);
  }
};

exports.getCollectionByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug.toLowerCase() }] }
      : { slug: idOrSlug.toLowerCase() };
    const collection = await Collection.findOne(query).populate('products');
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    res.json({ success: true, collection });
  } catch (err) {
    next(err);
  }
};

exports.createCollection = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name || '', { lower: true, strict: true });
    const collection = await Collection.create({ ...req.body, slug });
    await logAdminActivity(req.admin, 'Collection updated', collection.name, 'Created collection');
    res.status(201).json({ success: true, collection });
  } catch (err) {
    next(err);
  }
};

exports.updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    await logAdminActivity(req.admin, 'Collection updated', collection.name, 'Updated collection');
    res.json({ success: true, collection });
  } catch (err) {
    next(err);
  }
};

exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    await logAdminActivity(req.admin, 'Collection updated', collection.name, 'Deleted collection');
    res.json({ success: true, message: 'Collection deleted.' });
  } catch (err) {
    next(err);
  }
};

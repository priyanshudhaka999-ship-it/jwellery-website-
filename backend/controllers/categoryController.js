const slugify = require('slugify');
const Category = require('../models/Category');
const { logAdminActivity } = require('../utils/activityLogger');

exports.getCategories = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, displayOrder, isActive } = req.body;
    const slug = slugify(name || '', { lower: true, strict: true });
    const category = await Category.create({
      name,
      slug,
      description,
      image,
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
    });
    await logAdminActivity(req.admin, 'Category changed', category.name, 'Created category');
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    await logAdminActivity(req.admin, 'Category changed', category.name, 'Updated category');
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    await logAdminActivity(req.admin, 'Category changed', category.name, 'Deleted category');
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};

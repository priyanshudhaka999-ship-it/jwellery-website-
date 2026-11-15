const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, validateObjectId('id'), updateCategory);
router.delete('/:id', protectAdmin, validateObjectId('id'), deleteCategory);

module.exports = router;

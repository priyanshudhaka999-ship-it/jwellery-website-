const express = require('express');
const {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:idOrSlug', getProductByIdOrSlug);
router.post('/', protectAdmin, upload.array('images', 8), createProduct);
router.put('/:id', protectAdmin, validateObjectId('id'), upload.array('images', 8), updateProduct);
router.delete('/:id', protectAdmin, validateObjectId('id'), deleteProduct);

module.exports = router;

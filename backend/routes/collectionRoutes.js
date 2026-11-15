const express = require('express');
const {
  getCollections,
  getCollectionByIdOrSlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

router.get('/', getCollections);
router.get('/:idOrSlug', getCollectionByIdOrSlug);
router.post('/', protectAdmin, createCollection);
router.put('/:id', protectAdmin, validateObjectId('id'), updateCollection);
router.delete('/:id', protectAdmin, validateObjectId('id'), deleteCollection);

module.exports = router;

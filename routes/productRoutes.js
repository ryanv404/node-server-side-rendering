const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} = require('../controllers/productController');
const {getSingleProductReviews} = require('../controllers/reviewController');

router.route('/')
  .post(ensureAuthenticated, createProduct)
  .get(getAllProducts);

router.route('/uploadImage').post(ensureAuthenticated, uploadImage);

router.route('/:id')
  .get(getSingleProduct)
  .patch(ensureAuthenticated, updateProduct)
  .delete(ensureAuthenticated, deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;

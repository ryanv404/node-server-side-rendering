const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/')
  .post(ensureAuthenticated, createReview)
  .get(getAllReviews);

router.route('/:id')
  .get(getSingleReview)
  .patch(ensureAuthenticated, updateReview)
  .delete(ensureAuthenticated, deleteReview);

module.exports = router;

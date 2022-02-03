const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../controllers/authController");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.get("/", ensureAuthenticated, getAllReviews);
router.get("/:reviewID", ensureAuthenticated, getReview);
router.post("/", ensureAuthenticated, createReview);
router.put("/update/:reviewID", ensureAuthenticated, updateReview);
router.delete("/delete/:reviewID", ensureAuthenticated, deleteReview);

module.exports = router;
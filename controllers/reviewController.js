const moment = require("moment");
const Review = require("../models/Review"); 

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort("-createdAt -updatedAt");
    res.render("reviews", {
      title: "Reviews",
      reviews,
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get one review
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewID);
    res.json(review);
  } catch (error) {
    console.log(error);
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const alreadyExists = await Review.findOne({
      title: req.body.reviewTitle
    });
    
    if (alreadyExists) {
      req.flash("error_msg", "Your reviews must have unique titles.");
      return res.redirect("/reviews");
    }
    const newReview = new Review({
      title: req.body.reviewTitle,
      movieTitle: req.body.movieName,
      comment: req.body.reviewBody,
      rating: req.body.reviewRating,
      user: req.user._id
    });

    const successful = await Review.create(newReview);
    if (successful){
      req.flash("success_msg", "Review successfully created.");
    } else {
      req.flash("error_msg", "Unable to create your review.");
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/reviews");
};

// Update a review
const updateReview = async (req, res) => {
  try {
    let {movieTitle, reviewTitle, reviewContent, reviewRating} = req.body;
    
    reviewRating = parseInt(reviewRating) || 0;
    const successful = await Review.findByIdAndUpdate(req.params.reviewID, {
      title: reviewTitle,
      movieTitle: movieTitle,
      comment: reviewContent,
      rating: reviewRating
    });
    if (successful) {
      req.flash("success_msg", "Review successfully updated.");
    } else {
      req.flash("error_msg", "Unable to update your review.");
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/reviews");
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const successful = await Review.findOneAndDelete(req.params.reviewID);
    if (successful) {
      req.flash("success_msg", "Review successfully deleted.");
    } else {
      req.flash("error_msg", "Unable to delete your review.");
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/reviews");
};

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
};
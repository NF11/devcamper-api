const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews.controller");

const Review = require("../models/Review.schema");
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/customResults.middleware");
const {
  protect,
  authorize,
  checkOwner,
} = require("../middleware/auth.middleware");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post([protect, authorize("user", "admin")], addReview);

router
  .route("/:id")
  .get(getReview)
  .put([protect, authorize("user", "admin"), checkOwner(Review)], updateReview)
  .delete(
    [protect, authorize("user", "admin"), checkOwner(Review)],
    deleteReview
  );

module.exports = router;

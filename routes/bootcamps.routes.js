const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps.controller");
const {
  protect,
  authorize,
  checkOwner,
} = require("../middleware/auth.middleware");
const Bootcamp = require("../models/Bootcamp.schema");
const customResults = require("../middleware/customResults.middleware");
const uploadePhotoValidator = require("../middleware/uploadePhotoValidator.middleware");
// Include other resource router
const courseRouter = require("./courses.routes");
const reviewRouter = require("./reviews.routes");

const router = express.Router();

// @desc Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(customResults(Bootcamp, "courses"), getBootcamps)
  .post([protect, authorize("publisher", "admin")], createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(
    [protect, authorize("publisher", "admin"), checkOwner(Bootcamp)],
    updateBootcamp
  )
  .delete(
    [protect, authorize("publisher", "admin"), checkOwner(Bootcamp)],
    deleteBootcamp
  );

router
  .route("/:id/photo")
  .put(
    [
      protect,
      authorize("publisher", "admin"),
      checkOwner(Bootcamp),
      uploadePhotoValidator(Bootcamp),
    ],
    uploadBootcampPhoto
  );

module.exports = router;

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
const { protect } = require("../middleware/auth.middleware");
const Bootcamp = require("../models/Bootcamp.schema");
const customResults = require("../middleware/customResults.middleware");
const uploadePhotoValidator = require("../middleware/uploadePhotoValidator.middleware");
// Include other resource router
const courseRouter = require("./courses.routes");

const router = express.Router();

// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(customResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, [uploadePhotoValidator(Bootcamp)], uploadBootcampPhoto);

module.exports = router;

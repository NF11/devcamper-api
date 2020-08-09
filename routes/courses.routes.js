const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller");
const Course = require("../models/Course.schema");
const customResults = require("../middleware/customResults.middleware");
const {
  protect,
  authorize,
  checkOwner,
} = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    customResults(Course, {
      path: "bootcamp",
      // select: "name description",
    }),
    getCourses
  )
  .post([protect, authorize("publisher", "admin")], createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(
    [protect, authorize("publisher", "admin"), checkOwner(Course)],
    updateCourse
  )
  .delete(
    [protect, authorize("publisher", "admin"), checkOwner(Course)],
    deleteCourse
  );

module.exports = router;

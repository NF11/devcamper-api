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
const { protect } = require("../middleware/auth.middleware");

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
  .post(protect, createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;

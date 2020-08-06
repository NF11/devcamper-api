const Course = require("../models/Course.schema");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler.middleware");

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).send({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    const courses = await Course.find();
    res.status(200).send({
      success: true,
      count: courses.length,
      data: courses,
    });
  }
});

const Course = require("../models/Course.schema");
const Bootcamp = require("../models/Bootcamp.schema");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler.middleware");

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const result = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).send({
      success: true,
      count: result.length,
      data: result,
    });
  } else {
    res.status(200).send(res.customResults);
  }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const result = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    // select: "name description",
  });
  if (!result)
    return next(
      new errorResponse("No Course with id of " + req.params.id),
      404
    );
  res.status(200).send({
    success: true,
    data: result,
  });
});

// @desc create new Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  //add user to req body
  req.body.user = req.user;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp)
    return next(
      new errorResponse("No bootcamp with id of " + req.params.bootcampId),
      404
    );
  const result = await Course.create(req.body);
  res.status(201).send({ success: true, data: result });
});

// @desc Update Course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const result = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).send({ success: true, data: result });
});

// @desc Delete Course
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const result = await Course.findById(req.params.id);
  result.remove();
  res.status(201).send({ success: true, data: result });
});

const Bootcamp = require("../models/Bootcamp.schema");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler.middleware");
// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const result = await Bootcamp.find();
  res.status(200).send({ success: true, count: result.length, data: result });
});

// @desc get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const result = await Bootcamp.findById(req.params.id);
  if (!result)
    return next(new errorResponse(`not found with id ${req.params.id}`, 404));
  res.status(200).send({ success: true, data: result });
});

// @desc create new bootcamps
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const result = await Bootcamp.create(req.body);
  res.status(201).send({ success: true, data: result });
});

// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const result = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result)
    return next(new errorResponse(`not found with id ${req.params.id}`, 404));
  res.status(200).send({ success: true, data: result });
});

// @desc delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const result = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!result)
    return next(new errorResponse(`not found with id ${req.params.id}`, 404));
  res.status(200).send({ success: true, data: result });
});

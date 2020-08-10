const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/asyncHandler.middleware");
const User = require("../../models/User.schema");

// @desc      Get all user
// @route     POST /api/v1/auth/users
// @access    Privet/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.customResults);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Privet/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const result = await User.findById(req.params.id);
  res.status(200).send({ success: true, data: result });
});

// @desc      Create user
// @route     POST /api/v1/auth/users/
// @access    Privet/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const result = await User.create(req.body);
  res.status(201).send({ success: true, data: result });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({ success: true, data: user });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).send({ success: true, data: {} });
});

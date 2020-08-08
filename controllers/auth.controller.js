const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler.middleware");
// const sendEmail = require('../utils/sendEmail');
const User = require("../models/User.schema");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const result = await User.create({ name, email, password, role });
  const token = result.getSignedJwtToken();
  res.status(200).send({ success: true, token });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse("Please provided email and password", 400));

  const result = await User.findOne({ email }).select("+password");
  if (!result) return next(new ErrorResponse("Invalid credential", 400));
  //check password
  const isMatch = await result.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse("Invalid credential", 400));

  const token = result.getSignedJwtToken();
  res.status(200).send({ success: true, token });
});

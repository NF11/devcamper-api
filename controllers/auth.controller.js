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
  sendTokenResponse(result, 200, res);
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

  sendTokenResponse(result, 200, res);
});
// @desc      Get current user logged
// @route     GET /api/v1/auth/me
// @access    Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const result = await User.findById(req.user);
  res.status(200).send({ success: true, data: result });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode = 200, res) => {
  const token = user.getSignedJwtToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .send({ success: true, token });
};

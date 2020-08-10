const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const sendEmail = require("../utils/sendEmail");
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

// @desc      Logout current user logged / Clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).send({ success: true, data: {} });
});

// @desc      Get current user logged
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const result = await User.findById(req.user);
  res.status(200).send({ success: true, data: result });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/update-details
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/update-password
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgot-password
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const result = await User.findOne({ email: req.body.email });
  if (!result)
    return next(new ErrorResponse("There is no user with that email", 400));
  //Get rest token
  const resetToken = result.getResetPasswordToken();
  await result.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has 
  requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: result.email,
      subject: "password reset token",
      message,
    });
    res.status(200).send({ success: true, data: "email sent" });
  } catch (e) {
    console.log(e);
    result.resetPasswordToken = undefined;
    result.resetPasswordExpire = undefined;
    await result.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be send", 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/reset-password/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed password
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const result = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!result) return next(new ErrorResponse("Invalid token", 400));

  // Set new password
  result.password = req.body.password;
  result.resetPasswordExpire = undefined;
  result.resetPasswordToken = undefined;

  await result.save();
  sendTokenResponse(result, 200, res);
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

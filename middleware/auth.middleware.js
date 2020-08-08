const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler.middleware");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User.schema");

// @desc Protect route
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const headersAuth = req.headers.authorization;
  if (headersAuth && headersAuth.startsWith("Bearer")) {
    token = headersAuth.split(` `)[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }
  //  Make sure token exists
  if (!token)
    return next(new ErrorResponse("Not authorize to access this route", 401));
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // affect new attr to req with user info
    req.user = await User.findById(decode.id);
    next();
  } catch (e) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

// @desc Grant access to specific roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      )
    );
  }
  next();
};

// @desc Grant access to specific roles to do action
exports.checkOwner = (Model) => async (req, res, next) => {
  let result = await Model.findById(req.params.id);
  if (!result)
    return next(new ErrorResponse(`not found with id ${req.params.id}`, 404));

  // Make sure user is the owner
  if (
    result.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized todo this action`,
        401
      )
    );
  next();
};

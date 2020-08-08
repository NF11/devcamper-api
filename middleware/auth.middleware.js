const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler.middleware");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User.schema");

// Protect route
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
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (e) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

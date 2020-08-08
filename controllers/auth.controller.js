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
  const result = User.create({ name, email, password, role });
  res.status(200).send({ success: true });
});

const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-details", protect, updateDetails);
router.put("/update-password", protect, updatePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

module.exports = router;

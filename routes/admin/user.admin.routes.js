const express = require("express");
const {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} = require("../../controllers/admin/users.admin.contrroller");

const User = require("../../models/User.schema");

const { protect, authorize } = require("../../middleware/auth.middleware");
const customResults = require("../../middleware/customResults.middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(customResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;

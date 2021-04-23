const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;

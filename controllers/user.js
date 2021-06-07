const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const key = req.query.keyword;

  const users = ["user", "admin", "merchant"].includes(key)
    ? await User.find({ role: key })
    : await User.find();

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate(
      "myMazads",
      "name start_time end_time start_price market_price expected_price current_price photo"
    )
    .populate(
      "wonMazads",
      "name start_time end_time start_price market_price expected_price current_price photo"
    )
    .populate(
      "interested_mazads",
      "name start_time end_time start_price market_price expected_price current_price photo"
    );

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

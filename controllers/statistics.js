const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Request = require("../models/Request");
const { request } = require("express");

// @desc      Get Statistics
// @route     GET /api/v1/statist
// @access    Private/Admin
exports.getStatist = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  const requests = await Request.find();

  var statis = {};
  statis.total_users = users.length;
  statis.total_requests = requests.length;
  statis.total_traffic = statis.total_users + statis.total_requests;

  statis.merchants = 0;
  statis.users = 0;
  statis.admins = 0;

  users.map((el) => {
    if (el.role == "merchant") statis.merchants++;
    else if (el.role == "user") statis.users++;
    else if (el.role == "admin") statis.admins++;
  });
  console.log(statis);

  res.status(200).json({
    success: true,
    data: statis,
  });
});

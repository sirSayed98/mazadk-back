const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Request = require("../models/Request");
const Mazad = require("../models/Mazad");
const TimeNow = require("../utils/GetCurrentTime");

// @desc      Get Statistics
// @route     GET /api/v1/statist
// @access    Private/Admin
exports.getStatist = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  const requests = await Request.find();
  const Mazads = await Mazad.find();

  var statis = {};
  statis.total_users = users.length;
  statis.total_requests = requests.length;
  statis.total_traffic = statis.total_users + statis.total_requests;
  statis.total_Mazads = Mazads.length;

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

// @desc      Get Statistics
// @route     GET /api/v1/statist/merchant_statist
// @access    Private/Merchant
exports.merchantStatis = asyncHandler(async (req, res, next) => {
  const Mazads = await Mazad.find({ merchant: req.user.id });

  let currentMazads = 0;
  let finishedMazads = 0;
  let upcomingMazads = 0;
  let currentTime = TimeNow();

  Mazads.forEach((el) => {
    if (el.start_time > currentTime) upcomingMazads = upcomingMazads + 1;
    else if (el.start_time <= currentTime && currentTime < el.end_time)
      currentMazads = currentMazads + 1;
    else if (el.end_time <= currentTime) finishedMazads = finishedMazads + 1;
  });
  var obj = {};
  obj.currentMazads = currentMazads;
  obj.finishedMazads = finishedMazads;
  obj.upcomingMazads = upcomingMazads;
  obj.total = currentMazads + finishedMazads + upcomingMazads;

  res.status(200).json({
    success: true,
    data: obj,
  });
});

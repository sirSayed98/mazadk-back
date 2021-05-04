const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Request = require("../models/Request");

// @desc      Get all Requests
// @route     GET /api/v1/requests
// @access    Private/Admin
exports.getRequests = asyncHandler(async (req, res, next) => {
  const requests = await Request.find();

  res.status(200).json({
    success: true,
    data: requests,
  });
});

// @desc      Get single Request
// @route     GET /api/v1/requests/:id
// @access    Private/Admin
exports.getRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: request,
  });
});

// @desc      Create Request
// @route     POST /api/v1/requests
// @access    Private/Admin
exports.createRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.create(req.body);

  res.status(201).json({
    success: true,
    data: request,
  });
});

// @desc      Accept/Reject request
// @route     PUT /api/v1/requests/:id
// @access    Private/Admin
exports.dealWithRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  request.accepted = req.body.accepted;

  await request.save();
  console.log(req.body);
  console.log(request);

  res.status(200).json({
    success: true,
    data: request,
  });
});

/*
const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();


*/

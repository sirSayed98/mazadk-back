const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Request = require("../models/Request");
const User = require("../models/User");
const generator = require("generate-password");
const sendEmail = require("./../utils/sendEmail");


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
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(404).json({
      success: false,
      message: "email is registered before",
    });
  }

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
  if (request.checked === true) {
    return next(new ErrorResponse(`request has been accepted before`, 400));
  }

  request.accepted = req.body.accepted;
  request.checked = true;

  await request.save();

  if (req.body.accepted == true) {
    var password = generator.generate({
      length: 10,
      numbers: true,
    });
    const data = {
      name: request.companyName,
      email: request.email,
      role: "merchant",
      password: password,
      phone: request.phone,
      verified: true,
    };
    await User.create(data);

    const message = `Your request has been approved \n your email is: 
     ${data.email} \n password: ${data.password} \n you can change it. `;
    await sendEmail({
      email: request.email,
      subject: "Congratulations !",
      message,
    });
    res.status(200).json({
      success: true,
      data: request,
    });
  } else {
    const message = `Your request has been rejected you can communicate with the platform owner. `;
    await sendEmail({
      email: request.email,
      subject: "Rejected !",
      message,
    });
    res.status(200).json({
      success: true,
      data: request,
    });
  }
});

// @desc      Delete Request
// @route     DELETE /api/v1/request/:id
// @access    Private/Admin
exports.deleteRequest = asyncHandler(async (req, res, next) => {
  await Request.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

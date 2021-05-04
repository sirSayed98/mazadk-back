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
  if (request.accepted===true){
    return next(
      new ErrorResponse(`request has been accepted before`, 400)
    );
  }

  request.accepted = req.body.accepted;

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
    };
     await User.create(data);

     const message=`Your request has been approved \n your email is: 
     ${data.email} \n password: ${data.password} \n you can change it. `;
     await sendEmail({
      email: data.email,
      subject: "Congratulations !",
      message,
    });

  }
  else{
    const message=`Your request has been rejected you can communicate with the platform owner. `;
     await sendEmail({
      email: request.email,
      subject: "Rejected !",
      message,
    });
  }

  
  res.status(200).json({
    success: true,
    data: request
  });
});

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("./../utils/sendEmail");

//@desc       Register User
//@route      GET/api/v1/auth/register
//@access     public
exports.register = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword, role } = req.body;

  if (role === "admin")
    return next(new ErrorResponse("Register as admin is not allowed"), 400);

  if (password !== confirmPassword)
    return next(
      new ErrorResponse(`password and confirm password don't match`, 400)
    );
  //create user
  const user = await User.create(req.body);
  const verifyToken = user.getVerifiedToken();
  const message = `https://mazadk.vercel.app/verify/${verifyToken}`;

  // save hashed token and expire date
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Confirm Your Email",
      message,
    });
    res.status(200).json({ success: true, msg: "Email sent" });
  } catch (error) {
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//@desc       Register User
//@route      GET/api/v1/auth/verify/:token
//@access     public
exports.verifyRegisterToken = asyncHandler(async (req, res, next) => {
  // Get hashed token

  const verifiedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verifiedToken,
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.verifiedToken = undefined;
  user.verified = true;
  await user.save();

  sendTokenResponse(user, 200, req, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const dataPopulated =
    "name photo start_time end_time start_price market_price expected_price current_price";
  // Check for user
  const user = await User.findOne({ email })
    .select("+password")
    .populate("myMazads", dataPopulated)
    .populate("wonMazads", dataPopulated)
    .populate("interested_mazads", dataPopulated);

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (user.verified == false) {
    return next(new ErrorResponse("Your account has not been verified", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, req, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgetPassword
// @access    Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // save hashed token and expire date
  await user.save({ validateBeforeSave: false });
  //to stop run validation which will ask to enter required fields

  try {
    // Create reset url
    const message = `https://mazadk.vercel.app/reset_password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, msg: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, req, res);
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatePassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, req, res);
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
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

// @desc      Update ME
// @route     PUT /api/v1/auth/
// @access    Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.name = req.body.name;
  user.address = req.body.address;
  user.phone = req.body.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), //10 sec
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
  console.log(res.cookies);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, req, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  user.token = token;
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

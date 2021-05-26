const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Mazad = require("../models/Mazad");
const User = require("../models/User");

// @desc      Get all Mazads
// @route     GET /api/v1/mazads
// @access    Private/[merchant-admins]
exports.getMazads = asyncHandler(async (req, res, next) => {
  const Mazads =
    req.user.role === "admin"
      ? await Mazad.find()
      : await Mazad.find({ merchant: req.user._id });

  res.status(200).json({
    success: true,
    data: Mazads,
  });
});

// @desc      Get single mazad
// @route     GET /api/v1/mazads/:id
// @access    public
exports.getMazad = asyncHandler(async (req, res, next) => {
  const mazad = await Mazad.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: mazad,
  });
});

// @desc      Get single mazad
// @route     GET /api/v1/mazads
// @access    private [admin-merchant]
exports.createMazad = asyncHandler(async (req, res, next) => {
  console.log("____________");
  const { start_price } = req.body;
  req.body.current_price = start_price;
  const mazad = await Mazad.create(req.body);
  res.status(201).json({
    success: true,
    data: mazad,
  });
});

// @desc      Delete Mazad
// @route     DELETE /api/v1/Mazad/:id
// @access    private [admin-merchant]
exports.deleteMazad = asyncHandler(async (req, res, next) => {
  const mazad = await Mazad.find({ merchant: req.user._id });

  if (req.use.role == "merchant" && req.user._id !== mazad.merchant) {
    return next(
      new ErrorResponse(`This mazad for another merchant not you`, 400)
    );
  }
  await Mazad.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Update Mazad
// @route     PUT /api/v1/Mazad/:id
// @access    private [admin-merchant]
exports.updateMazad = asyncHandler(async (req, res, next) => {
  let mazad = await Mazad.find({ merchant: req.user._id });

  if (req.use.role == "merchant" && req.user._id !== mazad.merchant) {
    return next(
      new ErrorResponse(`This mazad for another merchant not you`, 400)
    );
  }

  mazad = await Mazad.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: mazad,
  });
});

// @desc      Join Mazad
// @route     Post /api/v1/Mazad/join/:id
// @access    Private [user - admin]
exports.joinMazad = asyncHandler(async (req, res, next) => {
  let mazad = await Mazad.findById(req.params.id);
  if (!mazad) {
    return next(new ErrorResponse("This mazad doesn't exist.", 404));
  }

  if (mazad.end_time < Date.now()) {
    return next(new ErrorResponse(`This mazad has already ended`, 400));
  }

  let user = await User.findById(req.user.id);
  user.myMazads.push(mazad._id);
  await user.save();

  mazad.subscribers.push(user._id);
  await mazad.save();

  res.status(200).json({
    success: true,
    data: mazad,
  });
});

// @desc      Bid end point
// @route     Post /api/v1/Mazad/bid/:id
// @access    Private [user - admin]
exports.bidNow = asyncHandler(async (req, res, next) => {
  let mazad = await Mazad.findById(req.params.id);
  if (!mazad) {
    return next(new ErrorResponse("This mazad doesn't exist.", 404));
  }

  if (!mazad.subscribers.find((id) => id == req.user.id)) {
    return next(new ErrorResponse("you are not subcribed to this mazad."));
  }

  if (!(mazad.start_time < Date.now() && mazad.end_time > Date.now())) {
    return next(
      new ErrorResponse(`This mazad is not available currently`, 400)
    );
  }

  const { added_value } = req.body;
  mazad.current_price += added_value;
  await mazad.save();

  res.status(200).json({
    success: true,
    data: mazad,
  });
});

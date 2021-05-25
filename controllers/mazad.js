const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Mazad = require("../models/Mazad");

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
  const Mazad = await Mazad.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: Mazad,
  });
});

// @desc      Get single mazad
// @route     GET /api/v1/mazads
// @access    private [admin-merchant]
exports.createMazad = asyncHandler(async (req, res, next) => {
  const Mazad = await Mazad.create(req.body);
  res.status(201).json({
    success: true,
    data: Mazad,
  });
});

// @desc      Delete Mazad
// @route     DELETE /api/v1/Mazad/:id
// @access    private [admin-merchant]
exports.deleteMazad = asyncHandler(async (req, res, next) => {
  const Mazad = await Mazad.find({ merchant: req.user._id });

  if (req.user._id !== Mazad.merchant) {
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

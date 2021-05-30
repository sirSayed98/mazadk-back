const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Mazad = require("../models/Mazad");
const User = require("../models/User");
const TimeNow = require("../utils/GetCurrentTime");
const schedule = require("node-schedule");

// @desc      Get all Mazads
// @route     GET /api/v1/mazads
// @access    public
exports.getMazads = asyncHandler(async (req, res, next) => {
  let Mazads;
  if (req.query.next && req.query.next == 1) {
    // Future mazads
    console.log(req.query.next);
    Mazads =
      req.user.role === "admin"
        ? await Mazad.find({ start_time: { $gte: currentTime } })
        : await Mazad.find({
            merchant: req.user._id,
            start_time: { $gte: currentTime },
          });
  } else {
    // All mazads
    Mazads =
      req.user.role === "admin"
        ? await Mazad.find()
        : await Mazad.find({ merchant: req.user._id });
  }

  opts = [
    { path: "interested_subscribers" },
    { path: "subscribers" },
    { path: "winner" },
    { path: "merchant" },
    { path: "higher_bidder" },
  ];
  await Mazad.populate(Mazads, opts);

  res.status(200).json({
    success: true,
    data: Mazads,
  });
});

// @desc      Get current mazads
// @route     GET /api/v1/mazads
// @access    Puplic
exports.getCurrentMazads = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();
  let mazads = await Mazad.find({
    start_time: { $lte: currentTime },
  });

  let filtered = mazads.filter((el) => {
    return el.finished === false;
  });
  res.status(200).json({
    success: true,
    data: filtered,
  });
});

// @desc      Get not subscribed mazads for user
// @route     GET /api/v1/mazads
// @access    Private
exports.getCurrentMazadsByUser = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();
  let mazads = await Mazad.find({ start_time: { $lte: currentTime } });

  let filteredMazads = mazads.filter((el) => {
    return (
      req.user.myMazads.includes(el._id.toString()) === false &&
      el.finished === false
    );
  });

  res.status(200).json({
    success: true,
    data: filteredMazads,
  });
});

// @desc      Get not subscribed mazads for user
// @route     GET /api/v1/mazads
// @access    public
exports.getUpComingMazads = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();
  let mazads = await Mazad.find({ start_time: { $gte: currentTime } });

  res.status(200).json({
    success: true,
    data: mazads,
  });
});

// @desc      Get not subscribed mazads for user
// @route     GET /api/v1/mazads
// @access    Private
exports.getUpComingMazadsByUser = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();
  let mazads = await Mazad.find({ start_time: { $gte: currentTime } });

  let filteredMazads = mazads.filter((el) => {
    return (
      req.user.interested_mazads.includes(el._id.toString()) === false &&
      el.finished === false
    );
  });

  res.status(200).json({
    success: true,
    data: filteredMazads,
  });
});

// @desc      Get single mazad
// @route     GET /api/v1/mazads/:id
// @access    public
exports.getMazad = asyncHandler(async (req, res, next) => {
  const mazad = await Mazad.findById(req.params.id)
    .populate("interested_subscribers", "name photo")
    .populate("subscribers", "name photo");

  res.status(200).json({
    success: true,
    data: mazad,
  });
});

// @desc      Get single mazad
// @route     GET /api/v1/mazads
// @access    private [admin-merchant]
exports.createMazad = asyncHandler(async (req, res, next) => {
  const { start_price, end_time } = req.body;
  req.body.current_price = start_price;
  const mazad = await Mazad.create(req.body);

  schedule.scheduleJob(end_time, async function () {
    mazad.finished = true;
    await mazad.save();
  });

  res.status(201).json({
    success: true,
    data: mazad,
  });
});

// @desc      Delete Mazad
// @route     DELETE /api/v1/Mazad/:id
// @access    private [admin-merchant]
exports.deleteMazad = asyncHandler(async (req, res, next) => {
  const mazad = await Mazad.findById(req.params.id);

  if (
    req.user.role == "merchant" &&
    req.user._id.toString() !== mazad.merchant.toString()
  ) {
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
  let mazad = await Mazad.findById(req.params.id);

  if (
    req.user.role == "merchant" &&
    req.user._id.toString() !== mazad.merchant.toString()
  ) {
    return next(
      new ErrorResponse(`This mazad for another merchant not you`, 400)
    );
  }

  const {
    name,
    describtion,
    start_price,
    market_price,
    expected_price,
    increased_value,
    start_time,
    end_time,
  } = req.body;

  mazad.name = name;
  mazad.describtion = describtion;
  mazad.start_price = start_price;
  mazad.market_price = market_price;
  mazad.expected_price = expected_price;
  mazad.increased_value = increased_value;
  mazad.start_time = start_time;
  mazad.end_time = end_time;

  schedule.scheduleJob(end_time, async function () {
    mazad.finished = true;
    await mazad.save();
  });

  await mazad.save();
  res.status(200).json({
    success: true,
    data: mazad,
  });
});

// @desc      Join Mazad
// @route     Post /api/v1/Mazad/join/:id
// @access    Private [user - admin]
exports.joinMazad = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();

  let mazad = await Mazad.findById(req.params.id);
  if (!mazad) {
    return next(new ErrorResponse("This mazad doesn't exist.", 404));
  }

  if (mazad.end_time < currentTime) {
    return next(new ErrorResponse(`This mazad has already ended`, 400));
  }

  let user = await User.findById(req.user.id);
  if (user.myMazads.find((id) => id == String(mazad._id))) {
    return next(
      new ErrorResponse("You are already subscribed to this mazad", 400)
    );
  }

  user.myMazads.push(mazad._id);
  await user.save();

  mazad.subscribers.push(user._id);
  await mazad.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Join Mazad
// @route     Post /api/v1/Mazad/join/:id
// @access    Private [user - admin]
exports.interestMazad = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();

  let mazad = await Mazad.findById(req.params.id);
  if (!mazad) {
    return next(new ErrorResponse("This mazad doesn't exist.", 404));
  }

  if (mazad.end_time < currentTime) {
    return next(new ErrorResponse(`This mazad has already ended`, 400));
  }

  let user = await User.findById(req.user.id);

  if (user.interested_mazads.find((id) => id == String(mazad._id))) {
    return next(
      new ErrorResponse("You are already make this mazad in interest list", 400)
    );
  }

  user.interested_mazads.push(mazad._id);
  await user.save();

  mazad.interested_subscribers.push(user._id);
  await mazad.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Bid end point
// @route     Post /api/v1/Mazad/bid/:id
// @access    Private [user - admin]
exports.bidNow = asyncHandler(async (req, res, next) => {
  let currentTime = TimeNow();

  let mazad = await Mazad.findById(req.params.id);
  if (!mazad) {
    return next(new ErrorResponse("This mazad doesn't exist.", 404));
  }

  if (!mazad.subscribers.find((id) => id == req.user.id)) {
    return next(new ErrorResponse("you are not subcribed to this mazad."));
  }

  if (!(mazad.start_time < currentTime && mazad.end_time > currentTime)) {
    return next(
      new ErrorResponse(`This mazad is not available currently`, 400)
    );
  }

  const { newVal } = req.body;

  if (mazad.current_price < newVal) {
    mazad.current_price = newVal;
    mazad.higher_bidder = req.user.id;
    await mazad.save();
    res.status(200).json({
      success: true,
      data: mazad,
    });
  } else {
    res.status(406).json({
      success: false,
      Message: "there is a new value to bid",
    });
  }
});

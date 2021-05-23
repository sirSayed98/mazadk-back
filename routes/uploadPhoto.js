const express = require("express");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const router = express.Router();

const { protect } = require("../middleware/auth");

const construct = (req, path) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.image;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > 1000000) {
    return next(
      new ErrorResponse(`Please upload an image less than ${1000000}`, 400)
    );
  }

  // Create custom filename
  file.name = `${Date.now()}_${file.name}`;

  file.mv(`public/uploads/${path}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  let tmp = `/uploads/${path}/${file.name}`;
  return tmp;
};

router.use(protect);

router.post("/user", async (req, res) => {
  const ret = construct(req, "user");
  const user = await User.findById(req.user.id);
  
  user.photo = ret;

  await user.save();
  
  res.status(200).json({
    success: true,
    data: user,
  });

});
router.post("/mazad", (req, res) => {
  const ret = construct(req, "mazad");

  res.status(200).json(ret);
});

module.exports = router;

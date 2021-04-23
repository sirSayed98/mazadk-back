const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  forgetPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);


router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;

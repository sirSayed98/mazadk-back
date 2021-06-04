const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateMe,
  verifyRegisterToken,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.put("/updateMe", protect, updateMe);

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

router.put("/updatepassword", protect, updatePassword);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/verify/:token", verifyRegisterToken);

module.exports = router;

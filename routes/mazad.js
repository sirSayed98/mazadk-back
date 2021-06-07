const express = require("express");
const {
  getMazads,
  getMazad,
  createMazad,
  deleteMazad,
  updateMazad,
  joinMazad,
  bidNow,
  getCurrentMazadsByUser,
  getCurrentMazads,
  getUpComingMazads,
  getUpComingMazadsByUser,
  interestMazad,
  contactWinners
} = require("../controllers/mazad");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("admin", "merchant"), createMazad);

router.route("/").get(protect, authorize("admin", "merchant"), getMazads);

router.route("/join/:id").post(protect, authorize("user", "admin"), joinMazad);

router
  .route("/interest/:id")
  .post(protect, authorize("user", "admin"), interestMazad);

router.route("/bid/:id").post(protect, authorize("user", "admin"), bidNow);

router.route("/current_mazads_user").get(protect, getCurrentMazadsByUser);
router.route("/current_mazads").get(getCurrentMazads);

router.route("/upcoming_mazads_user").get(protect, getUpComingMazadsByUser);
router.route("/upcoming_mazads").get(getUpComingMazads);

router
  .route("/contact_winners")
  .get(protect, authorize("merchant"), contactWinners);

router
  .route("/:id")
  .put(protect, authorize("admin", "merchant"), updateMazad)
  .get(getMazad)
  .delete(protect, authorize("admin", "merchant"), deleteMazad);

module.exports = router;

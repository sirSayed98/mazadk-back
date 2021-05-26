const express = require("express");
const {
  getMazads,
  getMazad,
  createMazad,
  deleteMazad,
  updateMazad,
  joinMazad,
  bidNow,
} = require("../controllers/mazad");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("admin", "merchant"), createMazad);

router.route("/").get(protect, authorize("admin", "merchant"), getMazads);

router.route("/join/:id").post(protect, authorize("user", "admin"), joinMazad);

router.route("/bid/:id").post(protect, authorize("user", "admin"), bidNow);

router
  .route("/:id")
  .put(authorize("admin", "merchant"), updateMazad)
  .get(getMazad)
  .delete(authorize("admin", "merchant"), deleteMazad);

module.exports = router;

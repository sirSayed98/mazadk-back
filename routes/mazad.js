const express = require("express");
const {
  getMazads,
  getMazad,
  createMazad,
  deleteMazad,
  updateMazad,
} = require("../controllers/mazad");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("admin", "merchant"), createMazad);

router.route("/").get(protect, authorize("admin", "merchant"), getMazads);

router
  .route("/:id")
  .put(authorize("admin", "merchant"), updateMazad)
  .get(getMazad)
  .delete(authorize("admin", "merchant"), deleteMazad);

module.exports = router;

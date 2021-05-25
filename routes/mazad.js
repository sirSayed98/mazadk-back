const express = require("express");
const {
  getMazads,
  getMazad,
  createMazad,
  deleteMazad,
} = require("../controllers/mazad");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("admin", "merchant"), createMazad);

router.route("/").get(protect, authorize("admin", "merchant"), getMazads);

router
  .route("/:id")
  .get(getMazad)
  .delete(authorize("admin", "merchant"), deleteMazad);

module.exports = router;

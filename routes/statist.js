const express = require("express");
const { getStatist, merchantStatis } = require("../controllers/statistics");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin", "merchant"));

router.route("/").get(getStatist);
router.route("/merchant_statist").get(merchantStatis);

module.exports = router;

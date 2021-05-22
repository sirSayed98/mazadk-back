const express = require("express");
const {
    getStatist
} = require("../controllers/statistics");



const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.route("/").get(getStatist);

module.exports = router;
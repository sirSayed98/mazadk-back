const express = require("express");
const {
  getRequests,
  getRequest,
  createRequest,
  dealWithRequest,
} = require("../controllers/request");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(createRequest);

router.use(protect, authorize("admin"));
router.route("/").get(getRequests);

router.route("/:id").get(getRequest).put(dealWithRequest);

module.exports = router;

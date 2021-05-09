const express = require("express");
const {
  getRequests,
  getRequest,
  createRequest,
  dealWithRequest,
  deleteRequest,
} = require("../controllers/request");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(createRequest);

router.use(protect, authorize("admin"));
router.route("/").get(getRequests);

router.route("/:id").get(getRequest).put(dealWithRequest).delete(deleteRequest);

module.exports = router;

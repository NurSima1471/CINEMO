const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getHybrid,
  getContentBased,
  getGenreBased,
  getPopular,
} = require("../controllers/recommendationController");

router.get("/hybrid", protect, getHybrid);
router.get("/content/:movieId", getContentBased);
router.post("/genre", protect, getGenreBased);
router.get("/popular", getPopular);

module.exports = router;

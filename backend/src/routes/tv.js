const router = require("express").Router();
const { getTvDetails, getTvSimilar } = require("../controllers/tvController");

// Detay rotası
router.get("/:id", getTvDetails);
// Benzerler rotası
router.get("/:id/similar", getTvSimilar);

module.exports = router;
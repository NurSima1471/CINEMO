const express = require("express");
const router = express.Router();
const { toggleWatchlist, getProfile } = require("../controllers/user.controller");
// Auth middleware'ini (token kontrolü için) import etmeyi unutma
// (Dosya yolu sende farklı olabilir, kontrol et: middleware/auth.js gibi)
const { protect } = require("../middleware/auth"); 

// NOT: Senin middleware ismin 'verifyToken' veya 'protect' olabilir.
// Auth route'larında ne kullanıyorsan onu kullan. Ben örnek olarak 'protect' dedim.

// Endpoint: /api/users/watchlist/toggle
router.post("/watchlist/toggle", protect, toggleWatchlist);

// Endpoint: /api/users/profile
router.get("/profile", protect, getProfile);

module.exports = router;
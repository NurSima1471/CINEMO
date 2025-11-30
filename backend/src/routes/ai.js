const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAIRecommendations,
  updateAIProfile,
  chatRecommendation,
  analyzeContent,
  getTrends,
  listModels
} = require('../controllers/aiController');

// Gemini AI endpoint'leri
router.post('/recommend', protect, getAIRecommendations);
router.post('/update-profile', protect, updateAIProfile);
router.post('/chat', protect, chatRecommendation);
router.post('/analyze', protect, analyzeContent);
router.get('/trends', getTrends);
router.get('/models', listModels);

module.exports = router;

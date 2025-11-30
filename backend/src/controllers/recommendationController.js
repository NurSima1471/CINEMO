const recommendationService = require("../services/recommendationService");

exports.getHybrid = async (req, res) => {
  try {
    const recs = await recommendationService.getHybridRecommendations(
      req.user.id,
      20
    );
    res.json({ success: true, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getContentBased = async (req, res) => {
  try {
    const { movieId } = req.params;
    const recs = await recommendationService.getContentBasedRecommendations(
      Number(movieId),
      10
    );
    res.json({ success: true, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGenreBased = async (req, res) => {
  try {
    const { genres, limit = 10 } = req.body;
    const recs = await recommendationService.getGenreBasedRecommendations(
      genres || [],
      limit
    );
    res.json({ success: true, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPopular = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recs = await recommendationService.getPopularRecommendations(
      Number(limit)
    );
    res.json({ success: true, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

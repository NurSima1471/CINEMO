const tmdbService = require("../services/tmdbService");

exports.getTrending = async (req, res) => {
  try {
    const movies = await tmdbService.getTrending();
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPopular = async (req, res) => {
  try {
    const movies = await tmdbService.getPopular();
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const movies = await tmdbService.getTopRated();
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeries = async (req, res) => {
  try {
    const series = await tmdbService.getSeries();
    res.json({ success: true, data: series });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMovieDetail = async (req, res) => {
  try {
    const movie = await tmdbService.getMovieDetails(req.params.id);
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await tmdbService.search(q || "");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

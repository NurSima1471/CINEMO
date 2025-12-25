const tmdbService = require("../services/tmdbService");

exports.getTrending = async (req, res) => {
  try {
    // Frontend'den gelen sayfa numarasını al, yoksa 1 kabul et
    const page = req.query.page || 1; 
    
    // Servise sayfa numarasını gönder
    const movies = await tmdbService.getTrending(page);
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPopular = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const movies = await tmdbService.getPopular(page);
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const movies = await tmdbService.getTopRated(page);
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeries = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const series = await tmdbService.getSeries(page);
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

exports.getSimilarMovies = async (req, res) => {
  try {
    const { id } = req.params;
    // Benzer filmler sayfasında genelde pagination olmaz ama gerekirse eklenebilir
    // Şimdilik sadece ID ile çağırıyoruz
    const similarMovies = await tmdbService.getSimilarMovies(id);
    res.json({ success: true, data: similarMovies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();
    res.json({ success: true, data: genres });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { mediaType } = req.query; // "all", "movie", "tv"
    const results = await tmdbService.searchByGenre(genreId, mediaType || "all");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const axios = require("axios");

// TMDB API URL ve Key'i
const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY; // .env dosyanızda bu değişkenin olduğundan emin olun

exports.getTvDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Axios ile doğrudan TMDB'ye istek atıyoruz
    const response = await axios.get(`${TMDB_URL}/tv/${id}`, {
      params: {
        api_key: TMDB_KEY,
        language: "tr-TR",
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    // Hata detayını terminale yazdıralım ki görelim
    console.error("TV Detay Hatası:", error.message);
    next(error);
  }
};

exports.getTvSimilar = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${TMDB_URL}/tv/${id}/recommendations`, {
      params: {
        api_key: TMDB_KEY,
        language: "tr-TR",
        page: 1,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
    });
  } catch (error) {
    console.error("TV Benzer Hatası:", error.message);
    next(error);
  }
};
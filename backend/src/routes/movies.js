const express = require("express");
const router = express.Router();
const {
  getTrending,
  getPopular,
  getTopRated,
  getSeries,
  getMovieDetail,
  searchMovies,
  getSimilarMovies,
  getGenres,
  searchByGenre,
} = require("../controllers/movieController");

router.get("/trending", getTrending);
router.get("/popular", getPopular);
router.get("/top-rated", getTopRated);
router.get("/series", getSeries);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/genre/:genreId", searchByGenre);
router.get("/:id/similar", getSimilarMovies); // <--- YENİ EKLENEN
router.get("/:id", getMovieDetail);

module.exports = router;

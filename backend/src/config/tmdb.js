const axios = require("axios");

const tmdbAxios = axios.create({
  baseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  headers: { "Content-Type": "application/json" },
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: "tr-TR",
  },
});

module.exports = tmdbAxios;


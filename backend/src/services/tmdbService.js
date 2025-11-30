const tmdbAxios = require("../config/tmdb");
const Movie = require("../models/Movie");

class TMDBService {
  async saveMoviesToDB(results = []) {
    if (!Array.isArray(results)) return [];

    const mapped = results.map((m) => ({
      tmdbId: m.id,
      title: m.title || m.name || "Untitled",
      overview: m.overview || "",
      posterPath: m.poster_path || "",
      backdropPath: m.backdrop_path || "",
      genres: (m.genre_ids || []).map((id) => ({ id, name: String(id) })), 
      // genre name'leri detay isteğinde dolacak, şimdilik id string koyduk
      releaseDate: m.release_date || m.first_air_date || "",
      mediaType: m.media_type || (m.first_air_date ? "tv" : "movie"),
      voteAverage: m.vote_average || 0,
      voteCount: m.vote_count || 0,
      popularity: m.popularity || 0,
    }));

    // upsert
    for (const item of mapped) {
      await Movie.updateOne(
        { tmdbId: item.tmdbId },
        { $set: item },
        { upsert: true }
      );
    }

    return mapped;
  }

  async getTrending() {
    const res = await tmdbAxios.get("/trending/movie/week");
    return this.saveMoviesToDB(res.data.results);
  }

  async getPopular() {
    const res = await tmdbAxios.get("/movie/popular");
    return this.saveMoviesToDB(res.data.results);
  }

  async getTopRated() {
    const res = await tmdbAxios.get("/movie/top_rated");
    return this.saveMoviesToDB(res.data.results);
  }

  async getSeries() {
    const res = await tmdbAxios.get("/tv/popular");
    return this.saveMoviesToDB(res.data.results);
  }

  async getMovieDetails(id) {
    const res = await tmdbAxios.get(`/movie/${id}`);
    const m = res.data;

    const movieDoc = {
      tmdbId: m.id,
      title: m.title || "Untitled",
      overview: m.overview || "",
      posterPath: m.poster_path || "",
      backdropPath: m.backdrop_path || "",
      genres: (m.genres || []).map((g) => ({ id: g.id, name: g.name })),
      releaseDate: m.release_date || "",
      mediaType: "movie",
      voteAverage: m.vote_average || 0,
      voteCount: m.vote_count || 0,
      popularity: m.popularity || 0,
      runtime: m.runtime || null,
    };

    await Movie.updateOne(
      { tmdbId: movieDoc.tmdbId },
      { $set: movieDoc },
      { upsert: true }
    );

    return movieDoc;
  }

  async search(query) {
    const res = await tmdbAxios.get("/search/movie", {
      params: { query },
    });
    const results = res.data.results || [];

    // İlk olarak temel bilgileri kaydet
    await this.saveMoviesToDB(results);

    // Daha doğru tür isimleri için ilk birkaç sonuca detay isteği at ve döndür
    const detailed = [];
    for (const r of results.slice(0, 5)) {
      try {
        const det = await this.getMovieDetails(r.id);
        detailed.push(det);
      } catch (e) {
        // hata olursa atla
        console.warn("Failed to fetch movie details for", r.id, e.message || e);
      }
    }

    return detailed.length > 0 ? detailed : this.saveMoviesToDB(results);
  }
}

module.exports = new TMDBService();

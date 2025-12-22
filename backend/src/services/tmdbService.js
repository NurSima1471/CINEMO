const tmdbAxios = require("../config/tmdb");
const Movie = require("../models/Movie");

class TMDBService {
  // Gelen verileri veritabanına kaydetme ve formatlama yardımcısı
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

    // Veritabanına "Upsert" işlemi (Varsa güncelle, yoksa ekle)
    for (const item of mapped) {
      await Movie.updateOne(
        { tmdbId: item.tmdbId },
        { $set: item },
        { upsert: true }
      );
    }

    return mapped;
  }

  // --- SAYFALAMA DESTEĞİ EKLENMİŞ METODLAR ---

  // Trendler (Sayfa numarası eklendi)
  async getTrending(page = 1) {
    const res = await tmdbAxios.get("/trending/movie/week", {
      params: { page } // Axios otomatik olarak ?page=X ekler
    });
    return this.saveMoviesToDB(res.data.results);
  }

  // Popüler Filmler (Sayfa numarası eklendi)
  async getPopular(page = 1) {
    const res = await tmdbAxios.get("/movie/popular", {
      params: { page }
    });
    return this.saveMoviesToDB(res.data.results);
  }

  // En Yüksek Puanlılar (Sayfa numarası eklendi)
  async getTopRated(page = 1) {
    const res = await tmdbAxios.get("/movie/top_rated", {
      params: { page }
    });
    return this.saveMoviesToDB(res.data.results);
  }

  // Popüler Diziler (Sayfa numarası eklendi)
  async getSeries(page = 1) {
    const res = await tmdbAxios.get("/tv/popular", {
      params: { page }
    });
    return this.saveMoviesToDB(res.data.results);
  }

  // --- DİĞER METODLAR ---

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
    // Sadece ilk 5 sonucu detaylı çekiyoruz performans için
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

  // Benzer Filmler
  async getSimilarMovies(id) {
    try {
      const res = await tmdbAxios.get(`/movie/${id}/similar`);
      // Gelen verileri veritabanı formatına uygun hale getirip döndürüyoruz
      return this.saveMoviesToDB(res.data.results);
    } catch (error) {
      console.warn(`Similar movies error for ID ${id}:`, error.message);
      // Hata olursa boş dizi dön ki frontend patlamasın
      return [];
    }
  }
}

module.exports = new TMDBService();
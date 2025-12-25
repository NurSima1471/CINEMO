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
    // Hem film hem dizi araması yap
    const [movieRes, tvRes] = await Promise.all([
      tmdbAxios.get("/search/movie", { params: { query } }),
      tmdbAxios.get("/search/tv", { params: { query } })
    ]);

    const movieResults = movieRes.data.results || [];
    const tvResults = tvRes.data.results || [];

    // Film sonuçlarına media_type ekle
    const moviesWithType = movieResults.map(m => ({ ...m, media_type: 'movie' }));
    // Dizi sonuçlarına media_type ekle
    const tvWithType = tvResults.map(t => ({ ...t, media_type: 'tv' }));

    // Tüm sonuçları birleştir
    const allResults = [...moviesWithType, ...tvWithType];

    // Popülariteye göre sırala
    allResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    // İlk 20 sonucu al
    const topResults = allResults.slice(0, 20);

    // Veritabanına kaydet
    await this.saveMoviesToDB(topResults);

    return topResults.map(item => ({
      tmdbId: item.id,
      title: item.title || item.name || "Untitled",
      overview: item.overview || "",
      posterPath: item.poster_path || "",
      backdropPath: item.backdrop_path || "",
      genres: (item.genre_ids || []).map((id) => ({ id, name: String(id) })),
      releaseDate: item.release_date || item.first_air_date || "",
      mediaType: item.media_type || "movie",
      voteAverage: item.vote_average || 0,
      voteCount: item.vote_count || 0,
      popularity: item.popularity || 0,
    }));
  }

  async getGenres() {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        tmdbAxios.get("/genre/movie/list", { params: { language: 'tr' } }),
        tmdbAxios.get("/genre/tv/list", { params: { language: 'tr' } })
      ]);

      // Film ve dizi türlerini birleştir ve tekrarları kaldır
      const allGenres = [
        ...movieGenres.data.genres,
        ...tvGenres.data.genres
      ];

      // Tekrarları kaldır (id'ye göre)
      const uniqueGenres = allGenres.reduce((acc, genre) => {
        if (!acc.find(g => g.id === genre.id)) {
          acc.push(genre);
        }
        return acc;
      }, []);

      return uniqueGenres;
    } catch (error) {
      console.error("Genre fetch error:", error);
      return [];
    }
  }

  async searchByGenre(genreId, mediaType = "all") {
    try {
      let results = [];

      if (mediaType === "all" || mediaType === "movie") {
        const movieRes = await tmdbAxios.get("/discover/movie", {
          params: { 
            with_genres: genreId,
            language: 'tr',
            sort_by: 'popularity.desc'
          }
        });
        const moviesWithType = movieRes.data.results.map(m => ({ ...m, media_type: 'movie' }));
        results = [...results, ...moviesWithType];
      }

      if (mediaType === "all" || mediaType === "tv") {
        const tvRes = await tmdbAxios.get("/discover/tv", {
          params: { 
            with_genres: genreId,
            language: 'tr',
            sort_by: 'popularity.desc'
          }
        });
        const tvWithType = tvRes.data.results.map(t => ({ ...t, media_type: 'tv' }));
        results = [...results, ...tvWithType];
      }

      // Popülariteye göre sırala ve ilk 20'yi al
      results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const topResults = results.slice(0, 20);

      // Veritabanına kaydet
      await this.saveMoviesToDB(topResults);

      return topResults.map(item => ({
        tmdbId: item.id,
        title: item.title || item.name || "Untitled",
        overview: item.overview || "",
        posterPath: item.poster_path || "",
        backdropPath: item.backdrop_path || "",
        genres: (item.genre_ids || []).map((id) => ({ id, name: String(id) })),
        releaseDate: item.release_date || item.first_air_date || "",
        mediaType: item.media_type || "movie",
        voteAverage: item.vote_average || 0,
        voteCount: item.vote_count || 0,
        popularity: item.popularity || 0,
      }));
    } catch (error) {
      console.error("Genre search error:", error);
      return [];
    }
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
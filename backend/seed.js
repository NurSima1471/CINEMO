// backend/seed.js
// Cinemo projesi için:
// - Demo kullanıcılar
// - TMDB'den gerçek filmler
// seed eder.
// Movie, User, Rating şemalarına göre ayarlanmıştır.

require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

// MODELLER (senin klasör yapına göre)
const User = require("./src/models/User");
const Movie = require("./src/models/Movie");
const Rating = require("./src/models/Rating");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cinemo";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Seedlemek istediğin TMDB film ID'leri (hepsi "movie")
const TMDB_MOVIE_IDS = [
  27205, // Inception
  157336, // Interstellar
  155, // The Dark Knight
  680, // Pulp Fiction
  238, // The Godfather
];

// TMDB'den movie detayı çeken helper
async function fetchTmdbMovie(tmdbId) {
  if (!TMDB_API_KEY) {
    console.warn(
      "⚠️ TMDB_API_KEY tanımlı değil, TMDB filmleri seed edilmeyecek."
    );
    return null;
  }

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      }
    );

    const data = res.data;

    // Movie.js şemana göre birebir:
    // tmdbId, title, overview, posterPath, backdropPath, genres[{id,name}],
    // releaseDate, mediaType, voteAverage, voteCount, popularity, runtime
    return {
      tmdbId: data.id,
      title: data.title,
      overview: data.overview || "",
      posterPath: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",
      backdropPath: data.backdrop_path
        ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
        : "",
      genres: data.genres
        ? data.genres.map((g) => ({
            id: g.id,
            name: g.name,
          }))
        : [],
      releaseDate: data.release_date || "",
      mediaType: "movie",
      voteAverage: data.vote_average ?? 0,
      voteCount: data.vote_count ?? 0,
      popularity: data.popularity ?? 0,
      runtime: data.runtime ?? null,
    };
  } catch (err) {
    console.error(
      `❌ TMDB isteğinde hata (${tmdbId}):`,
      err.response?.data || err.message
    );
    return null;
  }
}

async function seed() {
  try {
    console.log("⏳ MongoDB'ye bağlanılıyor:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı");

    // 1) Eski veriyi temizle
    console.log("🧹 Eski veriler temizleniyor (Users, Movies, Ratings)...");
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Rating.deleteMany({});

    // 2) Demo kullanıcılar (pre-save hook ile şifre hash'lenecek şekilde .save kullanıyoruz)
    console.log("🌱 Demo kullanıcılar ekleniyor...");
    const demoUsersData = [
      {
        name: "Alice Developer",
        email: "alice@example.com",
        password: "password123", // hash hook ile hashlenir
      },
      {
        name: "Bob Admin",
        email: "bob@example.com",
        password: "password123",
      },
    ];

    const users = [];
    for (const data of demoUsersData) {
      const user = new User(data);
      await user.save(); // pre('save') çalışır, şifre hashlenir
      users.push(user);
    }
    console.log(`👤 ${users.length} kullanıcı eklendi`);

    // 3) TMDB'den filmleri çek
    console.log("🌍 TMDB'den filmler çekiliyor...");
    const tmdbMovies = [];
    for (const id of TMDB_MOVIE_IDS) {
      const movie = await fetchTmdbMovie(id);
      if (movie) {
        tmdbMovies.push(movie);
        console.log(`   ✅ TMDB film eklenecek: ${movie.title}`);
      }
    }

    // Eğer TMDB_KEY yoksa, yine de boş geçmesin diye en azından 1-2 demo movie ekleyelim:
    if (!tmdbMovies.length) {
      console.log(
        "⚠️ TMDB filmi çekilemedi, yalnızca local demo filmler eklenecek."
      );
      tmdbMovies.push(
        {
          tmdbId: 9990001,
          title: "Local Demo Movie 1",
          overview: "Local demo movie without TMDB data.",
          posterPath: "",
          backdropPath: "",
          genres: [],
          releaseDate: "",
          mediaType: "movie",
          voteAverage: 7.5,
          voteCount: 10,
          popularity: 10,
          runtime: 120,
        },
        {
          tmdbId: 9990002,
          title: "Local Demo Movie 2",
          overview: "Another local demo movie.",
          posterPath: "",
          backdropPath: "",
          genres: [],
          releaseDate: "",
          mediaType: "movie",
          voteAverage: 8.0,
          voteCount: 15,
          popularity: 20,
          runtime: 110,
        }
      );
    }

    // 4) Filmleri DB'ye yaz
    const movies = await Movie.insertMany(tmdbMovies);
    console.log(`🎥 Toplam ${movies.length} film eklendi`);

    // 5) Basit rating seed (users[0], users[1] -> bazı filmlere oy versin)
    console.log("⭐ Demo rating'ler ekleniyor...");
    if (users.length && movies.length) {
      const ratingsData = [
        {
          user: users[0]._id,
          movieId: movies[0].tmdbId,
          rating: 9,
          review: "Amazing movie!",
        },
        {
          user: users[0]._id,
          movieId: movies[1].tmdbId,
          rating: 8,
          review: "Really enjoyed it.",
        },
        {
          user: users[1]._id,
          movieId: movies[0].tmdbId,
          rating: 8.5,
          review: "Great cinematography.",
        },
      ];

      await Rating.insertMany(ratingsData);
      console.log(`⭐ ${ratingsData.length} rating eklendi`);
    } else {
      console.log("⚠️ Rating seed atlanıyor (yeterli user/movie yok).");
    }

    console.log("🎉 SEED TAMAMLANDI — Başarıyla yüklendi!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed sırasında hata oluştu:", err);
    process.exit(1);
  }
}

seed();

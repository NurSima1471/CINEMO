const Movie = require('../models/Movie');
const User = require('../models/User');
const Rating = require('../models/Rating');

class RecommendationService {
  // Collaborative filtering - kullanıcı bazlı öneri
  async getUserBasedRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId);
      const userRatings = await Rating.find({ user: userId });
      
      if (userRatings.length === 0) {
        return await this.getPopularRecommendations(limit);
      }

      const ratedMovieIds = userRatings.map(r => r.movieId);
      const favoriteGenres = user.preferences?.genres || [];

      let query = {
        tmdbId: { $nin: ratedMovieIds }
      };

      if (favoriteGenres.length > 0) {
        query['genres.name'] = { $in: favoriteGenres };
      }

      const recommendations = await Movie.find(query)
        .sort({ voteAverage: -1, popularity: -1 })
        .limit(limit);

      return recommendations;
    } catch (error) {
      console.error('User-based recommendation error:', error);
      return [];
    }
  }

  // İçerik bazlı öneri - benzer filmler
  async getContentBasedRecommendations(movieId, limit = 10) {
    try {
      const movie = await Movie.findOne({ tmdbId: movieId });
      
      if (!movie) {
        return [];
      }

      const genreNames = movie.genres.map(g => g.name);

      const recommendations = await Movie.find({
        tmdbId: { $ne: movieId },
        'genres.name': { $in: genreNames },
        voteAverage: { $gte: movie.voteAverage - 1 }
      })
      .sort({ voteAverage: -1, popularity: -1 })
      .limit(limit);

      return recommendations;
    } catch (error) {
      console.error('Content-based recommendation error:', error);
      return [];
    }
  }

  // Popüler içerikler
  async getPopularRecommendations(limit = 10) {
    try {
      return await Movie.find()
        .sort({ popularity: -1, voteAverage: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Popular recommendation error:', error);
      return [];
    }
  }

  // Tür bazlı öneri
  async getGenreBasedRecommendations(genres, limit = 10) {
    try {
      return await Movie.find({
        'genres.name': { $in: genres }
      })
      .sort({ voteAverage: -1, popularity: -1 })
      .limit(limit);
    } catch (error) {
      console.error('Genre-based recommendation error:', error);
      return [];
    }
  }

  // Hibrit öneri sistemi
  async getHybridRecommendations(userId, limit = 20) {
    try {
      const userBased = await this.getUserBasedRecommendations(userId, Math.floor(limit * 0.6));
      const popular = await this.getPopularRecommendations(Math.floor(limit * 0.4));

      // Benzersiz filmleri birleştir
      const seen = new Set();
      const combined = [];

      for (const movie of [...userBased, ...popular]) {
        if (!seen.has(movie.tmdbId)) {
          seen.add(movie.tmdbId);
          combined.push(movie);
          if (combined.length >= limit) break;
        }
      }

      return combined;
    } catch (error) {
      console.error('Hybrid recommendation error:', error);
      return [];
    }
  }
}

module.exports = new RecommendationService();
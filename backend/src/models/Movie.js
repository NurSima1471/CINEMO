const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    overview: { type: String, default: "" },

    posterPath: { type: String, default: "" },
    backdropPath: { type: String, default: "" },

    genres: [
      {
        id: Number,
        name: String,
      },
    ],

    releaseDate: { type: String, default: "" },
    mediaType: { type: String, enum: ["movie", "tv"], default: "movie" },

    voteAverage: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },

    runtime: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, required: true }, // TMDB ID
    rating: { type: Number, min: 0, max: 10, required: true },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);

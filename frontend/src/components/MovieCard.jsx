import { Link } from "react-router-dom";

export default function MovieCard({ movie, size = "normal" }) {
  const poster = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const cls =
    size === "large"
      ? "w-44 md:w-56"
      : "w-36 md:w-44";

  return (
    <Link to={`/movie/${movie.tmdbId}`} className={`shrink-0 ${cls}`}>
      <div className="group relative">
        <img
          src={poster}
          alt={movie.title}
          className="rounded-md transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/40 transition" />

        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
          <h4 className="text-sm font-semibold line-clamp-2">
            {movie.title}
          </h4>
          <p className="text-xs text-white/70">
            ⭐ {movie.voteAverage?.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}

import { Link } from "react-router-dom";

export default function HeroSection({ movie }) {
  if (!movie) return null;

  const backdrop = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : "";

  return (
    <section className="relative h-[70vh] w-full">
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="relative z-10 px-6 pt-32 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold">{movie.title}</h1>
        <p className="mt-3 text-white/80 line-clamp-3">{movie.overview}</p>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/movie/${movie.tmdbId}`}
            className="bg-white text-black px-5 py-2 rounded font-semibold hover:opacity-90"
          >
            Detay
          </Link>

          <button className="bg-netflix-gray px-5 py-2 rounded font-semibold hover:opacity-90">
            Listeye Ekle
          </button>
        </div>
      </div>
    </section>
  );
}

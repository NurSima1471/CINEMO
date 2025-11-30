import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies = [], size = "normal" }) {
  if (!movies.length) return null;

  return (
    <section className="px-6">
      <h2 className="text-lg md:text-xl font-bold mb-3">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {movies.map((m) => (
          <MovieCard key={m.tmdbId} movie={m} size={size} />
        ))}
      </div>
    </section>
  );
}

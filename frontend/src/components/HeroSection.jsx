import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../services/api";
import { Plus, Check } from "lucide-react"; // İkonları import etmeyi unutma

export default function HeroSection({ movie }) {
  const [isInList, setIsInList] = useState(false); // Butonun görünümü için state
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde bu film listede mi diye kontrol et
  useEffect(() => {
    const checkListStatus = async () => {
      if (!movie) return;
      try {
        const res = await userAPI.getProfile();
        const watchlist = res.data.data.watchlist || [];
        // Film listede var mı kontrolü
        const exists = watchlist.some((item) => item.tmdbId === movie.tmdbId);
        setIsInList(exists);
      } catch (error) {
        console.error("Liste kontrol hatası:", error);
      }
    };

    checkListStatus();
  }, [movie]);

  if (!movie) return null;

  const backdrop = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : "";

  const handleToggleList = async () => {
    if (!movie || loading) return;

    // 1. UI'ı hemen güncelle (Kullanıcı beklemessin)
    const previousState = isInList;
    setIsInList(!previousState);
    setLoading(true);

    try {
      const movieData = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        voteAverage: movie.voteAverage,
      };

      await userAPI.toggleWatchlist(movieData);
      // Başarılı olursa başka bir şey yapmana gerek yok, UI zaten güncellendi.
    } catch (error) {
      console.error("Listeye ekleme hatası:", error);
      // Hata olursa UI'ı eski haline döndür
      setIsInList(previousState);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

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
            className="bg-white text-black px-8 py-3 rounded font-semibold hover:opacity-90 transition flex items-center justify-center"
          >
            Detay
          </Link>

          {/* --- İSTEDİĞİN BUTON KODU BURADA --- */}
          <button
            onClick={handleToggleList}
            disabled={loading}
            className={`flex items-center space-x-2 px-8 py-3 rounded transition font-semibold border ${
              isInList
                ? "bg-green-600/80 border-green-500 hover:bg-green-600 text-white"
                : "bg-gray-700/80 border-transparent hover:bg-gray-700 text-white"
            }`}
          >
            {isInList ? (
              <>
                <Check className="w-5 h-5" />
                <span>Listemde</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Listem</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
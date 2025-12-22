import { Link } from "react-router-dom";

export default function MovieCard({ movie, size = "normal", rank, variant = "standard" }) {
  // 1. DÜZELTME: Poster ve Link Hedefi
  const poster = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  // TMDB ID'yi ve Link Yapısını Belirle
  // Eğer mediaType 'tv' ise veya veride title yok ama name varsa bu bir dizidir
  const isTvShow = movie.mediaType === 'tv' || (!movie.title && movie.name);
  const tmdbId = movie.tmdbId || movie.id; // Bazı API'lerden tmdbId bazılandan id dönebilir
  const linkTarget = isTvShow ? `/tv/${tmdbId}` : `/movie/${tmdbId}`;
  
  // Title / Name uyumu
  const displayTitle = movie.title || movie.name;

  // --- 1. MOD: AI TREND TASARIMI (Rozetli ve İnce) ---
  if (variant === "ai-rank") {
    return (
      <Link 
        to={linkTarget} // <-- Dinamik Link
        className="relative group min-w-[130px] md:min-w-[160px] h-[220px] md:h-[280px] shrink-0 transition-all duration-300 hover:scale-105 hover:z-50 mx-2"
      >
        {/* Yuvarlak Sıra Rozeti (Sol Üst - BÜYÜTÜLMÜŞ HALİ) */}
        <div className="absolute -left-4 -top-4 w-12 h-12 flex items-center justify-center bg-black border-2 border-pink-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.7)] z-20">
          <span className="text-white font-bold text-2xl font-mono italic">#{rank}</span>
        </div>

        {/* Poster Alanı */}
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-800 group-hover:border-purple-500/50 shadow-lg relative">
          <img
            src={poster}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          
          {/* Hover Karartması */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>
      </Link>
    );
  }

  // --- 2. MOD: STANDART TASARIM (Eski Büyük Sayılar) ---
  
  const cls = rank 
    ? "w-32 md:w-40" 
    : size === "large" ? "w-44 md:w-56" : "w-36 md:w-44";

  const getRatingColor = (rating) => {
    if (!rating) return "text-white/70";
    if (rating >= 7) return "text-green-400";
    if (rating >= 4) return "text-orange-400";
    return "text-red-500";
  };


  return (
    <Link 
      to={linkTarget} // <-- Dinamik Link
      className={`shrink-0 ${cls} block relative group transition-transform duration-300 ease-out hover:z-50
        ${rank ? 'hover:scale-110 origin-center' : 'hover:scale-105 origin-center'}`}
    >
      <div className="flex items-end w-full h-full relative">
        
        {/* Eski Büyük Sayı (Standard Modda Görünür) */}
        {rank && (
          <div className="w-[50%] h-full z-20 flex items-end justify-end translate-y-3 pointer-events-none">
            <svg viewBox="0 0 100 150" className="h-32 md:h-44 w-full overflow-visible">
              <text x="100" y="150" fontSize="100" fill="black" stroke="white" strokeWidth="2" textAnchor="end" className="font-fantasy font-black tracking-tighter drop-shadow-md">
                {rank}
              </text>
            </svg>
          </div>
        )}

        <div className={`relative rounded-md overflow-hidden shadow-black/50 z-10 ${rank ? 'w-[65%] -ml-8' : 'w-full group-hover:shadow-xl'}`}>
          <img src={poster} alt={displayTitle} className="w-full h-full object-cover rounded-md" />
          
          {!rank && (
             <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
                <h4 className="text-base font-bold text-white line-clamp-2 drop-shadow-md leading-tight">{displayTitle}</h4>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium truncate drop-shadow-sm">
                  <span className={`flex items-center gap-1 ${getRatingColor(movie.voteAverage)}`}>⭐ {movie.voteAverage?.toFixed(1)}</span>
                  {/* Ekstra bilgi olarak tipini de gösterebilirsin */}
                 <span className="text-gray-400 text-[10px] uppercase border border-gray-600 px-1 rounded">
                    {isTvShow ? "TV SHOW" : "MOVIE"}
                  </span>
                </div>
              </div>
             </>
          )}
        </div>
      </div>
    </Link>
  );
}
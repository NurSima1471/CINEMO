import { useEffect, useMemo, useState, useRef } from "react"; // useRef eklendi
import { useParams, Link } from "react-router-dom";
import { moviesAPI, recommendationsAPI } from "../services/api";
import Loading from "../components/Loading";
import { 
  Star, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  ChevronDown, // Eklendi
  Check        // Eklendi
} from "lucide-react";

// Sıralama seçenekleri (Mevcut mantığa uygun değerler)
const sortOptions = [
  { value: "default", label: "Varsayılan" },
  { value: "rating", label: "Puana göre" },
  { value: "az", label: "A → Z" },
];

const CategoryPage = () => {
  const { type, genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default"); // default | rating | az

  // --- DROPDOWN STATE ---
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // Dışarı tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Seçili etiketi bulma
  const currentSortLabel = sortOptions.find(opt => opt.value === sort)?.label || "Sırala";
  // ---------------------

  useEffect(() => {
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, genreId]);

  const fetchCategoryData = async () => {
    setLoading(true);
    setMovies([]);

    let apiFunction = null;
    let pageTitle = "";

    // Genre sayfası kontrolü
    if (genreId) {
      try {
        // Genre bilgisini al
        const genresRes = await moviesAPI.getGenres();
        const genres = genresRes.data.success ? genresRes.data.data : [];
        const genre = genres.find(g => g.id === parseInt(genreId));
        
        pageTitle = genre ? `${genre.name} Filmleri & Dizileri` : "Tür Filmleri";
        
        // Genre'ye göre içerik çek
        const response = await moviesAPI.searchByGenre(genreId, "all");
        const genreMovies = response.data.success ? response.data.data : [];
        setMovies(genreMovies);
        setTitle(pageTitle);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Genre data fetch error:", error);
        setLoading(false);
        return;
      }
    }

    // Normal kategori sayfası
    switch (type) {
      case "trending":
        pageTitle = "Şu Anda Trend Olanlar";
        apiFunction = moviesAPI.getTrending;
        break;
      case "popular":
        pageTitle = "Popüler Filmler";
        apiFunction = moviesAPI.getPopular;
        break;
      case "top-rated":
        pageTitle = "En Yüksek Puanlılar";
        apiFunction = moviesAPI.getTopRated;
        break;
      case "series":
      case "tv":
        pageTitle = "Popüler Diziler";
        apiFunction = moviesAPI.getSeries;
        break;
      case "movie":
        pageTitle = "Popüler Filmler";
        apiFunction = moviesAPI.getPopular;
        break;
      case "recommendations":
        pageTitle = "Sizin İçin Öneriler";
        apiFunction = recommendationsAPI.getHybrid;
        break;
      default:
        pageTitle = "Filmler";
        apiFunction = moviesAPI.getPopular;
    }

    setTitle(pageTitle);

    try {
      let allMovies = [];

      if (type === "recommendations") {
        const response = await apiFunction();
        if (response && response.data) {
          allMovies =
            response.data.data || response.data.results || response.data || [];
        }
      } else {
        const pages = [1, 2, 3, 4, 5];
        const promises = pages.map((page) =>
          apiFunction(page).catch(() => null)
        );

        const responses = await Promise.all(promises);

        responses.forEach((res) => {
          if (!res || !res.data) return;

          let fetchedData = [];
          if (Array.isArray(res.data.data)) fetchedData = res.data.data;
          else if (Array.isArray(res.data.results)) fetchedData = res.data.results;
          else if (Array.isArray(res.data)) fetchedData = res.data;

          allMovies = [...allMovies, ...fetchedData];
        });
      }

      const uniqueMoviesMap = new Map();
      allMovies.forEach((movie) => {
        const uniqueId = movie.id || movie.tmdbId || movie._id || Math.random();
        if (!uniqueMoviesMap.has(uniqueId)) uniqueMoviesMap.set(uniqueId, movie);
      });

      const uniqueMovies = Array.from(uniqueMoviesMap.values());
      setMovies(uniqueMovies);
    } catch (error) {
      console.error("Genel veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayedMovies = useMemo(() => {
    const list = Array.isArray(movies) ? [...movies] : [];

    // search
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((m) =>
          ((m.title || m.name || "") + "").toLowerCase().includes(q)
        )
      : list;

    // sort
    if (sort === "rating") {
      filtered.sort((a, b) => {
        const ra = a.voteAverage ?? a.vote_average ?? 0;
        const rb = b.voteAverage ?? b.vote_average ?? 0;
        return rb - ra; // high -> low
      });
    } else if (sort === "az") {
      filtered.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || "", "tr")
      );
    } // default: dokunma

    return filtered;
  }, [movies, query, sort]);

  if (loading) return <Loading />;

 return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* HERO SECTION */}
      <div className="relative pt-20">
        
        {/* 1. DÜZELTME: overflow-hidden sadece arka plan efektleri için ayrı bir div'e taşındı */}
        <div className="absolute inset-0 h-[500px] w-full overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.22),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(239,68,68,0.14),transparent_45%)]" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-netflix-black/30 to-netflix-black" />
        </div>

        {/* 2. DÜZELTME: İçerik kısmı overflow-visible oldu, böylece dropdown taşabilir */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 pt-10 pb-10">
            <div className="max-w-screen-2xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight border-l-4 border-purple-600 pl-4">
                    {title}
                  </h1>
                  <p className="text-gray-400 mt-2 pl-4">
                    {displayedMovies.length} içerik{" "}
                    {query.trim() ? (
                      <span className="text-gray-500">
                        • “{query.trim()}” araması
                      </span>
                    ) : null}
                  </p>
                </div>

                {/* Controls */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 z-50"> {/* z-50 eklendi */}
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Bu kategoride ara…"
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                    />
                  </div>

                  {/* CUSTOM DROPDOWN */}
                  <div className="relative w-full sm:w-56" ref={sortDropdownRef}>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`
                        flex items-center justify-between w-full
                        bg-black/30 backdrop-blur-sm border border-white/10 
                        text-gray-200 text-base sm:text-sm font-medium
                        rounded-xl px-4 py-3 
                        transition-all duration-200
                        hover:bg-black/50 hover:border-purple-500/30
                        focus:outline-none focus:ring-2 focus:ring-purple-500/40
                        ${isSortOpen ? 'border-purple-500/50 bg-black/50' : ''}
                        `}
                    >
                        <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-purple-400" />
                        <span>{currentSortLabel}</span>
                        </div>
                        <ChevronDown 
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>

                    {/* Dropdown Menu - z-index ve position ayarları */}
                    {isSortOpen && (
                        <div className="absolute right-0 top-full mt-2 w-full bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl shadow-black/80 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-1">
                            {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                setSort(option.value);
                                setIsSortOpen(false);
                                }}
                                className={`
                                flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-colors
                                ${sort === option.value 
                                    ? 'bg-purple-500/10 text-purple-400' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                                `}
                            >
                                <span>{option.label}</span>
                                {sort === option.value && <Check className="w-3.5 h-3.5" />}
                            </button>
                            ))}
                        </div>
                        </div>
                    )}
                  </div>
                  {/* CUSTOM DROPDOWN BITIS */}

                </div>
              </div>
            </div>
        </div>

        {/* CONTENT (MOVIE GRID) */}
        <div className="relative z-0 px-4 md:px-8 lg:px-16 pb-12">
          <div className="max-w-screen-2xl mx-auto">
            {displayedMovies.length === 0 ? (
              <div className="mt-12 text-center py-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600/25 to-pink-500/25 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-300" />
                </div>
                <h3 className="text-xl font-bold mt-4">
                  {query.trim()
                    ? "Aramana uygun içerik bulunamadı."
                    : "İçerik bulunamadı."}
                </h3>
                <p className="text-gray-400 mt-2">
                  {query.trim()
                    ? "Farklı bir anahtar kelime deneyebilirsin."
                    : "Bir süre sonra tekrar kontrol edebilirsin."}
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold"
                >
                  Ana sayfaya dön
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {displayedMovies.map((movie, index) => {
  const posterPath = movie.posterPath || movie.poster_path;
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const rating = movie.voteAverage ?? movie.vote_average ?? 0;
  const linkId = movie.id || movie.tmdbId || movie._id;

  // --- DÜZELTME BURADA BAŞLIYOR ---
  // Eğer sayfa tipi "series" ise VEYA gelen veride media_type "tv" ise VEYA veride "title" yoksa ama "name" varsa (dizilerde name olur)
  const isTvShow = 
    type === "series" || 
    movie.media_type === "tv" || 
    (!movie.title && movie.name); 

  // Dizi ise "/tv/", film ise "/movie/" rotasına git
  const linkTarget = isTvShow ? `/tv/${linkId}` : `/movie/${linkId}`;
  // -------------------------------

  return (
    <Link
      to={linkTarget} // Link buraya dinamik olarak verildi
      key={`${linkId}-${index}`}
      className="group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-lg hover:shadow-red-900/20 transition"
    >
      <div className="relative aspect-[2/3]">
        <img
          src={imageUrl}
          alt={movie.title || movie.name || "İçerik"}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {Number(rating).toFixed(1)}
          </span>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="font-bold text-sm line-clamp-2">
              {movie.title || movie.name}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Detaya gitmek için tıkla
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CategoryPage;
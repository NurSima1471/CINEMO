import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { moviesAPI } from "../services/api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { Search, Frown, Film, Tv, Grid3X3 } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // URL'den ?q=değer kısmını alır
  const typeParam = searchParams.get("type"); // URL'den ?type=değer kısmını alır

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "movie", "tv"

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  // URL'den gelen type parametresini kontrol et
  useEffect(() => {
    if (typeParam && ["movie", "tv"].includes(typeParam)) {
      setActiveFilter(typeParam);
    } else {
      setActiveFilter("all");
    }
  }, [typeParam]);

  // Filtreleme işlemi
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredResults(results);
    } else {
      const filtered = results.filter(item => item.mediaType === activeFilter);
      setFilteredResults(filtered);
    }
  }, [results, activeFilter]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      // API.js içindeki search fonksiyonunu kullanıyoruz
      const res = await moviesAPI.search(query);
      
      // Backend'den gelen response formatını kontrol et
      const results = res.data.success ? res.data.data : res.data.results || [];
      
      // Gelen veride person (kişi) olmayanları filtreleyelim (sadece film/dizi)
      const filtered = results.filter(
        item => item.mediaType !== "person" && item.mediaType !== "person"
      );
      
      setResults(filtered);
      // URL'den gelen type parametresi varsa onu kullan, yoksa "all" yap
      if (typeParam && ["movie", "tv"].includes(typeParam)) {
        setActiveFilter(typeParam);
      } else {
        setActiveFilter("all");
      }
    } catch (error) {
      console.error("Arama hatası:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter butonları için sayıları hesapla
  const getFilterCounts = () => {
    const movieCount = results.filter(item => item.mediaType === "movie").length;
    const tvCount = results.filter(item => item.mediaType === "tv").length;
    return { all: results.length, movie: movieCount, tv: tvCount };
  };

  const counts = getFilterCounts();

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-netflix-black text-white pt-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-gray-400" />
          <span>"{query}" için sonuçlar</span>
        </h1>

        {/* Filter Butonları */}
        {results.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-zinc-800/60 text-gray-300 hover:bg-zinc-700/80 hover:text-white border border-zinc-700/50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Tümü</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === "all" ? "bg-white/20" : "bg-zinc-700"
                }`}>
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("movie")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === "movie"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-zinc-800/60 text-gray-300 hover:bg-zinc-700/80 hover:text-white border border-zinc-700/50"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Filmler</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === "movie" ? "bg-white/20" : "bg-zinc-700"
                }`}>
                  {counts.movie}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("tv")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === "tv"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-zinc-800/60 text-gray-300 hover:bg-zinc-700/80 hover:text-white border border-zinc-700/50"
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Diziler</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === "tv" ? "bg-white/20" : "bg-zinc-700"
                }`}>
                  {counts.tv}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Sonuçlar */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map((item) => (
              <div key={item.tmdbId} className="w-full">
                 <MovieCard movie={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Frown className="w-16 h-16 mb-4" />
            <p className="text-xl">
              {activeFilter === "all" 
                ? "Sonuç bulunamadı." 
                : `${activeFilter === "movie" ? "Film" : "Dizi"} bulunamadı.`
              }
            </p>
            <p className="text-sm">
              {activeFilter === "all" 
                ? "Lütfen farklı anahtar kelimelerle tekrar deneyin."
                : "Farklı bir filtre seçin veya arama terimini değiştirin."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
import { useEffect, useMemo, useState, useRef } from "react"; // useRef EKLENDİ
import { Link } from "react-router-dom";
import { userAPI } from "../services/api";
import Loading from "../components/Loading";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Trash2,
  Star,
  Crown,
  Search,
  ArrowUpDown,
  Sparkles,
  ChevronDown, // EKLENDİ
  Check,       // EKLENDİ
} from "lucide-react";

// Seçenekleri buraya sabit olarak tanımlayalım
const sortOptions = [
  { value: "recent", label: "Varsayılan" },
  { value: "rating", label: "Puan (Yüksek)" },
  { value: "title", label: "İsim (A-Z)" },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  
  // --- YENİ EKLENEN KISIM (DROPDOWN İÇİN) ---
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // Dışarı tıklandığında menüyü kapatmak için efekt
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Şu an seçili olanın etiketini bulma
  const currentSortLabel = sortOptions.find(opt => opt.value === sort)?.label || "Sırala";
  // ------------------------------------------

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setUser(res.data.data);
    } catch (error) {
      console.error("Profil yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = async (movie) => {
    if (!window.confirm(`"${movie.title}" listenizden kaldırılsın mı?`)) return;

    setRemovingId(movie.tmdbId);
    try {
      const movieData = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        voteAverage: movie.voteAverage,
      };

      await userAPI.toggleWatchlist(movieData);

      setUser((prev) => ({
        ...prev,
        watchlist: prev.watchlist.filter((item) => item.tmdbId !== movie.tmdbId),
      }));
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setRemovingId(null);
    }
  };

  const planLabel =
    user?.subscription?.plan === "premium" ? "Premium" : "Ücretsiz";

  const createdAtText = useMemo(() => {
    if (!user?.createdAt) return "-";
    return new Date(user.createdAt).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [user?.createdAt]);

  const membershipDays = useMemo(() => {
    if (!user?.createdAt) return 0;
    const start = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [user?.createdAt]);

  const watchlistCount = user?.watchlist?.length || 0;

  const filteredSorted = useMemo(() => {
    const list = Array.isArray(user?.watchlist) ? [...user.watchlist] : [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((m) => (m.title || "").toLowerCase().includes(q))
      : list;

    if (sort === "rating") {
      filtered.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
    } else if (sort === "title") {
      filtered.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr"));
    }
    return filtered;
  }, [user?.watchlist, query, sort]);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-netflix-black px-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <h2 className="text-2xl font-bold mb-2">Profil bulunamadı</h2>
          <p className="text-gray-400 mb-6">
            Kullanıcı bilgileri alınamadı. Lütfen giriş yapın.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition font-semibold"
          >
            Giriş Yap
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-netflix-black relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full opacity-40" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          
           {/* Avatar */}
           <div className="relative shrink-0">
             <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-2xl">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className="h-16 w-16 md:h-20 md:w-20"
                 viewBox="0 0 20 20"
                 fill="currentColor"
               >
                 <path
                   fillRule="evenodd"
                   d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                   clipRule="evenodd"
                 />
               </svg>
             </div>
             
             {/* Plan Badge */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border bg-netflix-black border-white/20 text-gray-200 shadow-lg">
                    {user.subscription?.plan === "premium" ? <Crown className="w-3 h-3 text-yellow-400" /> : <Star className="w-3 h-3" />}
                    {planLabel}
                 </span>
             </div>
           </div>

           {/* User Info */}
           <div className="flex-1 w-full text-center md:text-left">
               <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
                 <div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                     {user.name}
                   </h1>
                   <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                     <span className="flex items-center gap-2">
                       <Mail className="w-4 h-4 text-pink-500" />
                       {user.email}
                     </span>
                     <span className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-purple-500" />
                       Kayıt: {createdAtText}
                     </span>
                   </div>
                 </div>
               </div>

               {/* Stats Grid */}
               <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                     <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">İzleme Listem</p>
                     <p className="text-3xl font-bold mt-1 text-white">{watchlistCount}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                     <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Plan Durumu</p>
                     <p className="text-3xl font-bold mt-1 text-white">{planLabel}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                     <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Üyelik Süresi</p>
                     <p className="text-3xl font-bold mt-1 text-white">
                       {membershipDays} <span className="text-sm font-normal text-gray-400">Gün</span>
                     </p>
                  </div>
               </div>
           </div>
        </div>

        {/* DIVIDER */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* WATCHLIST SECTION */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  İzleme Listem
                  <span className="text-lg font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {watchlistCount}
                  </span>
                </h2>
                <p className="text-gray-400 mt-2">Kaydettiğin içeriklere buradan ulaşabilirsin.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-50"> {/* z-50 eklendi dropdown üstte kalsın diye */}
                
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Film veya dizi ara..."
                     className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500/50 transition text-sm"
                   />
                </div>
                
                {/* Custom Sort Dropdown (BURASI DEĞİŞTİ) */}
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`
                      flex items-center justify-between w-full sm:w-52
                      bg-white/5 backdrop-blur-sm border border-white/10 
                      text-gray-200 text-sm font-medium
                      rounded-xl px-4 py-3 
                      transition-all duration-200
                      hover:bg-white/10 hover:border-purple-500/30
                      focus:outline-none focus:ring-2 focus:ring-purple-500/20
                      ${isSortOpen ? 'border-purple-500/50 bg-white/10' : ''}
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

                  {/* Dropdown Menu */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
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

              </div>
          </div>

          {/* GRID */}
          {filteredSorted && filteredSorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
               {filteredSorted.map((movie) => (
                  <div key={movie.tmdbId} className="group relative">
                      {/* Poster Card */}
                      <Link to={`/movie/${movie.tmdbId}`} className="block relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 shadow-lg border border-white/5 group-hover:border-purple-500/30 transition duration-300">
                         {movie.posterPath ? (
                            <img 
                               src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                               alt={movie.title}
                               className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                            />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Poster Yok</div>
                         )}
                         
                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <p className="font-bold text-white text-sm line-clamp-2">{movie.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs font-medium">
                               <Star className="w-3 h-3 fill-yellow-400" />
                               {movie.voteAverage?.toFixed(1)}
                            </div>
                         </div>
                      </Link>

                      {/* Delete Button */}
                      <button
                          onClick={() => handleRemoveFromList(movie)}
                          disabled={removingId === movie.tmdbId}
                          className="absolute -top-2 -right-2 p-2 rounded-full bg-neutral-900 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:border-red-500 hover:text-white text-gray-400 z-10"
                          title="Listeden Kaldır"
                      >
                          {removingId === movie.tmdbId ? <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : <Trash2 className="w-3 h-3" />}
                      </button>
                  </div>
               ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-gray-600" />
               </div>
               <h3 className="text-xl font-bold text-white">Listeniz boş görünüyor</h3>
               <p className="text-gray-400 mt-2 max-w-xs mx-auto">Henüz izleme listenize bir içerik eklemediniz veya aramanızla eşleşen sonuç yok.</p>
               <Link to="/" className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition">Keşfetmeye Başla</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
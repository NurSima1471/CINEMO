import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; // 1. useLocation Eklendi
import { moviesAPI, recommendationsAPI, userAPI } from '../services/api';
import { Plus, Check, Star, Calendar, Clock, Layers } from 'lucide-react'; // Layers ikonu eklendi (Sezon için)
import MovieRow from '../components/MovieRow';
import Loading from "../components/Loading";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Location tanımlandı

  // URL içinde '/tv/' geçiyorsa bu bir dizidir
  const isTvShow = location.pathname.includes('/tv/');

  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isInList, setIsInList] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkWatchlistStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isTvShow]); // isTvShow dependency'e eklendi

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      
      // 3. API SEÇİMİ: Dizi ise TV servislerini, değilse Film servislerini çağır
      // NOT: api.js dosyanızda getTvDetails ve getTvRecommendations fonksiyonlarının olduğundan emin olun.
      // Yoksa aşağıya eklemeniz gereken kodu yazdım.
      
      const detailPromise = isTvShow 
        ? moviesAPI.getTvDetails(id) 
        : moviesAPI.getDetails(id);

      const similarPromise = isTvShow
        ? recommendationsAPI.getTvSimilar(id)
        : recommendationsAPI.getSimilar(id);

      const [movieRes, similarRes] = await Promise.all([
        detailPromise,
        similarPromise
      ]);

      setMovie(movieRes.data.data || movieRes.data);
      setSimilar(similarRes.data.data || similarRes.data.results || []);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await userAPI.getProfile(); 
      const watchlist = res.data.data.watchlist || [];
      const found = watchlist.some(item => Number(item.tmdbId) === Number(id));
      setIsInList(found);
    } catch (error) {
      console.log("Liste durumu kontrol edilemedi:", error);
    }
  };

  const handleToggleList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); 
      return;
    }

    const previousState = isInList;
    setIsInList(!previousState); 
    setListLoading(true);

    try {
      const movieIdToSend = movie?.id || Number(id); 

      const movieData = {
        tmdbId: movieIdToSend, 
        title: movie.title || movie.name, // Dizi için 'name', film için 'title'
        posterPath: movie.posterPath || movie.poster_path,
        voteAverage: movie.voteAverage || movie.vote_average || 0,
        mediaType: isTvShow ? 'tv' : 'movie' // İsterseniz backend'e tipini de gönderebilirsiniz
      };

      await userAPI.toggleWatchlist(movieData);
      
    } catch (error) {
      console.error("Listeye ekleme hatası:", error);
      setIsInList(previousState);
      alert("İşlem başarısız oldu.");
    } finally {
      setListLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-netflix-black text-white px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">İçerik Bulunamadı</h2>
        <Link to="/" className="text-purple-500 hover:underline">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const backdropPath = movie.backdropPath || movie.backdrop_path;
  const posterPath = movie.posterPath || movie.poster_path;
  
  const backdropUrl = backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : null;
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  // Dizi için bölüm süresi veya film süresi
  const runtime = movie.runtime || (movie.episode_run_time ? movie.episode_run_time[0] : null);
  const releaseDate = movie.release_date || movie.first_air_date;

  const getRatingStyle = (rating) => {
    if (!rating) return { box: "", star: "" };
    if (rating >= 7) return { box: "bg-green-500/20 text-green-400 border-green-500/50", star: "fill-green-400" };
    else if (rating >= 4) return { box: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", star: "fill-yellow-400" };
    else return { box: "bg-red-500/20 text-red-400 border-red-500/50", star: "fill-red-400" };
  };

  const currentRating = movie.voteAverage || movie.vote_average;
  const ratingStyle = getRatingStyle(currentRating);

  return (
    <div className="min-h-screen">
      <div className="relative h-screen">
        {backdropUrl && (
          <div className="absolute inset-0">
            <img src={backdropUrl} alt={movie.title || movie.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/70 to-netflix-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/50 to-transparent" />
          </div>
        )}

        <div className="relative h-full flex items-end px-4 md:px-8 lg:px-16 pb-32">
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl">
            {posterUrl && (
              <img src={posterUrl} alt={movie.title || movie.name} className="w-64 rounded-lg shadow-2xl hidden md:block" />
            )}

            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">{movie.title || movie.name}</h1>
              {movie.tagline && <p className="text-xl text-gray-300 italic">{movie.tagline}</p>}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {currentRating > 0 && (
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-md backdrop-blur-sm border ${ratingStyle.box}`}>
                    <Star className={`w-4 h-4 ${ratingStyle.star}`} />
                    <span className="font-bold text-base">{Number(currentRating).toFixed(1)}</span>
                  </div>
                )}
                
                {releaseDate && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(releaseDate).getFullYear()}</span>
                  </div>
                )}

                {runtime && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{runtime} dk</span>
                  </div>
                )}

                {/* Dizi ise Sezon Sayısı Göster */}
                {isTvShow && movie.number_of_seasons && (
                   <div className="flex items-center space-x-2 text-gray-300">
                     <Layers className="w-4 h-4" />
                     <span>{movie.number_of_seasons} Sezon</span>
                   </div>
                )}
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="px-4 py-1 bg-white/10 hover:bg-white/20 transition rounded-full text-sm backdrop-blur-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">{movie.overview}</p>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleToggleList}
                  disabled={listLoading}
                  className={`flex items-center space-x-2 px-8 py-3 rounded transition font-semibold border
                    ${isInList 
                      ? 'bg-green-600/80 border-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-700/80 border-transparent hover:bg-gray-700 text-white'
                    } ${listLoading ? 'opacity-70 cursor-wait' : ''}`}
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
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="relative -mt-32 z-10 pb-16 px-4 md:px-8 lg:px-16">
          <MovieRow title="Benzer İçerikler" movies={similar} />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
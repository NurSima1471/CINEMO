import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { moviesAPI, recommendationsAPI } from '../services/api';
import { Play, Plus, Star, Calendar, Clock, Loader2 } from 'lucide-react';
import MovieRow from '../components/MovieRow';
import Loading from "../components/Loading";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieRes, similarRes] = await Promise.all([
        moviesAPI.getDetails(id),
        recommendationsAPI.getSimilar(id)
      ]);

      setMovie(movieRes.data.data);
      setSimilar(similarRes.data.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

   if (loading) {
  return <Loading />;
}

 if (!movie) {
    return (
      // 1. Arka planı siyah yaptık (bg-netflix-black)
      <div className="flex flex-col items-center justify-center h-screen bg-netflix-black text-white px-4 text-center">
        
      

        <h2 className="text-3xl font-bold mb-2">İçerik Bulunamadı</h2>
        <p className="text-gray-400 mb-8">Aradığınız film silinmiş veya hiç eklenmemiş olabilir.</p>

        {/* 2. Linki sadece yazı olmaktan çıkarıp GRADIENT BUTON haline getirdik */}
        <Link 
          to="/" 
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 
                     text-white font-bold py-3 px-8 rounded-xl shadow-lg 
                     transform hover:scale-105 transition-all duration-300"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        {backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/70 to-netflix-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/50 to-transparent" />
          </div>
        )}

        <div className="relative h-full flex items-end px-4 md:px-8 lg:px-16 pb-32">
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl">
            {/* Poster */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt={movie.title || movie.name}
                className="w-64 rounded-lg shadow-2xl hidden md:block"
              />
            )}

            {/* Info */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                {movie.title || movie.name}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-gray-300 italic">{movie.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {movie.vote_average && (
                  <div className="flex items-center space-x-1 bg-yellow-600 px-3 py-1 rounded">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}

                {(movie.release_date || movie.first_air_date) && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(
                        movie.release_date || movie.first_air_date
                      ).getFullYear()}
                    </span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime} dk</span>
                  </div>
                )}

                {movie.number_of_seasons && (
                  <span className="px-3 py-1 bg-gray-700 rounded">
                    {movie.number_of_seasons} Sezon
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-1 bg-netflix-gray rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-lg text-gray-200 max-w-3xl">
                {movie.overview}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-semibold">
                  <Play className="w-5 h-5 fill-black" />
                  <span>İzle</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-700 px-8 py-3 rounded transition font-semibold">
                  <Plus className="w-5 h-5" />
                  <span>Listem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="relative -mt-32 z-10 pb-16">
          <MovieRow title="Benzer İçerikler" movies={similar} />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
import { useState, useEffect } from 'react';
import { moviesAPI, recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    hero: null,
    trending: [],
    popular: [],
    topRated: [],
    series: [],
    personalized: []
  });

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Paralel olarak tüm verileri çek
      const requests = [
        moviesAPI.getTrending(),
        moviesAPI.getPopular(),
        moviesAPI.getTopRated(),
        moviesAPI.getSeries()
      ];

      // Eğer kullanıcı giriş yaptıysa kişiselleştirilmiş önerileri de al
      if (isAuthenticated) {
        requests.push(recommendationsAPI.getHybrid());
      }

      const responses = await Promise.all(requests);

      setData({
        hero: responses[0].data.data[0], // Hero için ilk trending film
        trending: responses[0].data.data.slice(1, 21),
        popular: responses[1].data.data.slice(0, 20),
        topRated: responses[2].data.data.slice(0, 20),
        series: responses[3].data.data.slice(0, 20),
        personalized: isAuthenticated ? responses[4]?.data.data || [] : []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-netflix-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection movie={data.hero} />

      {/* Movie Rows */}
      <div className="relative -mt-32 z-10 space-y-8 pb-16">
        {/* Kişiselleştirilmiş Öneriler */}
        {isAuthenticated && data.personalized.length > 0 && (
          <MovieRow
            title="Sizin İçin Öneriler"
            movies={data.personalized}
            size="large"
          />
        )}

        {/* Trending */}
        <MovieRow
          title="Şu Anda Trend"
          movies={data.trending}
          size="normal"
        />

        {/* Popular Movies */}
        <MovieRow
          title="Popüler Filmler"
          movies={data.popular}
          size="normal"
        />

        {/* Top Rated */}
        <MovieRow
          title="En İyi Puanlananlar"
          movies={data.topRated}
          size="normal"
        />

        {/* Series */}
        <MovieRow
          title="Popüler Diziler"
          movies={data.series}
          size="normal"
        />
      </div>
    </div>
  );
};

export default Home;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI, recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import { Loader2 } from 'lucide-react';
import back1Image from '../assets/images/back1.png';
import back2Image from '../assets/images/back2.png';
import back3Image from '../assets/images/back3.png';
import back4Image from '../assets/images/back4.png';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Veri state'i
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

      // 1. ADIM: Trend verisi (HERKES İÇİN)
      // Trend isteğini listeye ekliyoruz.
      const requests = [moviesAPI.getTrending()];

      // 2. ADIM: Sadece Üyeler için diğer veriler
      if (isAuthenticated) {
        requests.push(moviesAPI.getPopular());     // Index 1
        requests.push(moviesAPI.getTopRated());    // Index 2
        requests.push(moviesAPI.getSeries());      // Index 3
        requests.push(recommendationsAPI.getHybrid()); // Index 4
      }

      // Tüm istekleri paralel olarak at
      const responses = await Promise.all(requests);

      // 3. ADIM: Verileri State'e İşleme
      // responses[0] her zaman Trend verisidir.
      const trendingData = responses[0].data.data;

      setData({
        // Hero: Üye ise veriden gelen ilk film, değilse null (Static Hero kullanacağız)
        hero: isAuthenticated ? trendingData[0] : null,
        
        // Trend: Herkes görür
        trending: trendingData.slice(1, 21),
        
        // Diğerleri: Sadece üye ise doldur, değilse boş dizi
        popular: isAuthenticated ? responses[1]?.data.data.slice(0, 20) : [],
        topRated: isAuthenticated ? responses[2]?.data.data.slice(0, 20) : [],
        series: isAuthenticated ? responses[3]?.data.data.slice(0, 20) : [],
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
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  // --- MİSAFİR KULLANICI GÖRÜNÜMÜ ---
if (!isAuthenticated) {
  
  // "Bize Katılmanız İçin Nedenler" verisi
  const reasons = [
    {
      title: "Advanced AI Analysis",
    desc: "Forget generic suggestions. Our AI analyzes your viewing history and ratings to provide spot-on recommendations.",
      icon: (
  <svg className="w-12 h-12 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
  </svg>
)
    },
    {
      title: "Discover by Mood",
    desc: "It's not just about genre; feelings matter. Find movies and shows that perfectly match your current vibe.",
      icon: (
  <svg className="w-12 h-12 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
)
    },
    {
      title: "Smart Watchlists",
    desc: "Keep all your favorites from different platforms in one place. Create your ultimate watchlist.",
      icon: (
  <svg className="w-12 h-12 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
  </svg>
)
    },
    {
      title: "End Decision Fatigue",
    desc: "Stop scrolling and start watching. Save the time you spend searching and find the perfect match immediately.",
      icon: (
  <svg className="w-12 h-12 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
)
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      
      {/* 1. HERO BÖLÜMÜ */}
      <div className="relative w-full h-[85vh]">
       {/* --- ARKA PLAN (4 RESİM ALT ALTA) --- 
             
          */}
          <div className="absolute inset-0 flex flex-col z-0">
            <div className="flex-1 w-full bg-cover bg-center" style={{ backgroundImage: `url(${back1Image})` }} />
            <div className="flex-1 w-full bg-cover bg-center" style={{ backgroundImage: `url(${back2Image})` }} />
            <div className="flex-1 w-full bg-cover bg-center" style={{ backgroundImage: `url(${back3Image})` }} />
            
             {/* Siyah Karartma */}
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
        </div>

        {/* Yazılar ve Buton */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight drop-shadow-xl">
            Can't decide what to watch?
          </h1>
          <p className="text-lg md:text-2xl text-white mt-4 font-medium drop-shadow-md">
            Stop scrolling for hours. Let AI learn your taste and find the perfect movie or TV show for you in seconds.
          </p>
          <div className="mt-8 w-full max-w-md">
             <Link 
                to="/login"
               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold py-3 px-8 rounded flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/40 mx-auto"
              >
                Start Exploring <span className="text-2xl">›</span>
              </Link>
          </div>
        </div>
      </div>

     {/* 2. KAVİSLİ GEÇİŞ (THE ARCH) */}
      
      <div className="relative -mt-16 w-full h-24 overflow-hidden z-20">
          {/* Dış Katman: Gradient Arka Plan + Shadow */}
          <div className="absolute left-[-10%] w-[120%] h-[200%] rounded-[50%] bg-gradient-to-r from-purple-600 to-pink-600 pt-[4px] shadow-[0_-5px_30px_rgba(219,39,119,0.4)]">
              {/* İç Katman: Siyah Arka Plan (Maskeleme görevi görür) */}
              <div className="w-full h-full bg-black rounded-[50%]"></div>
          </div>
      </div>

      {/* 3. İÇERİK ALANI (Siyah Arka Plan) */}
      <div className="relative z-30 bg-black pb-20 px-4 md:px-16">
        
        {/* A) TREND LİSTESİ */}
<div className="-mt-12 mb-16">
   
   <MovieRow
    title="Trending Now" 
    movies={data.trending?.slice(0, 10)}
    size="normal"
    isRanked={true}
    variant="ai-rank"  
    gap="gap-4" 
/>
</div>

        {/* B) BİZE KATILMANIZ İÇİN NEDENLER (Grid Kartlar) */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            More Reasons to Join
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reasons.map((item, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-[#1e1b26] to-[#131118] p-6 rounded-2xl border border-white/10 relative overflow-hidden group min-h-[250px] flex flex-col justify-between"
              >
                {/* İçerik */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* İkon (Sağ alt köşe) */}
                <div className="flex justify-end mt-4">
                   {item.icon}
                </div>
                
                {/* Hafif parlama efekti */}
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
  // --- GİRİŞ YAPMIŞ KULLANICI GÖRÜNÜMÜ ---
  return (
    <div className="min-h-screen bg-black">
      <HeroSection movie={data.hero} />

      <div className="relative -mt-32 z-10 space-y-8 pb-16 pl-4 md:pl-8">
        {isAuthenticated && data.personalized.length > 0 && (
          <MovieRow
            title="Sizin İçin Öneriler"
            movies={data.personalized}
            size="large"
          />
        )}

        <MovieRow
          title="Şu Anda Trend"
          movies={data.trending}
          size="normal"
        />

        <MovieRow
          title="Popüler Filmler"
          movies={data.popular}
          size="normal"
        />

        <MovieRow
          title="En İyi Puanlananlar"
          movies={data.topRated}
          size="normal"
        />

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
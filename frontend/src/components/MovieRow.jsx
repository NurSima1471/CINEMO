import React, { useRef, useState, useEffect } from 'react';
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies = [], size = "normal", isRanked = false, gap = "gap-4" , variant = "standard"}) {
  const sliderRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

  if (!movies.length) return null;

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const pages = Math.round(scrollWidth / clientWidth);
      setTotalPages(pages);
      const current = Math.round(scrollLeft / clientWidth);
      setCurrentPage(current);
      setIsMoved(scrollLeft > 0);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [movies]);

  const slideLeft = () => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      sliderRef.current.scrollLeft -= clientWidth;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        sliderRef.current.scrollLeft = 0;
      } else {
        sliderRef.current.scrollLeft += clientWidth;
      }
    }
  };

  return (
    <section className="px-10 md:px-12 my-8 group/row relative max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        
        {totalPages > 1 && (
          <div className="flex gap-1 mb-1 items-center">
            {[...Array(totalPages)].map((_, index) => (
              <div 
                key={index}
                className={`h-1 w-4 rounded-sm transition-colors duration-300 ${
                  index === currentPage ? "bg-gray-200" : "bg-gray-600"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
      
      
      <div className="relative w-fit mx-auto max-w-full">
        
    {/* SOL OK */}
<button 
  onClick={slideLeft}
  className={`absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 z-50 w-6 md:w-8 h-32 md:h-40 bg-zinc-800 text-white/70 hidden group-hover/row:flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-zinc-700 hover:text-white hover:scale-y-105 rounded-lg border border-white/5 shadow-xl
    ${!isMoved ? 'hidden' : ''}`}
>
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
   </svg>
</button>

        {/* LİSTE */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          // gap değişkeni buradan geliyor (gap-1 veya gap-4)
          className={`flex ${gap} overflow-x-scroll scroll-smooth scrollbar-hide items-center px-4 py-12`}
        >
          {movies.map((m, index) => (
            <MovieCard 
              key={m.tmdbId} 
              movie={m} 
              size={size} 
              rank={isRanked ? index + 1 : null} 
              variant={variant} 
            />
          ))}
        </div>

       {/* SAĞ OK */}
<button 
  onClick={slideRight}
  className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 z-50 w-6 md:w-8 h-32 md:h-40 bg-zinc-800 text-white/70 hidden group-hover/row:flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-zinc-700 hover:text-white hover:scale-y-105 rounded-lg border border-white/5 shadow-xl"
>
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
   </svg>
</button>
      </div>
    </section>
  );
}
// src/components/Loading.jsx

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-netflix-black text-white">
      
      {/* Yazı ve Noktalar */}
      <h1 className="text-4xl font-bold tracking-widest flex items-end">
        Loading
        {/* 1. Nokta */}
        <span className="animate-blink ml-1" style={{ animationDelay: '0s' }}>.</span>
        {/* 2. Nokta */}
        <span className="animate-blink ml-1" style={{ animationDelay: '0.2s' }}>.</span>
        {/* 3. Nokta */}
        <span className="animate-blink ml-1" style={{ animationDelay: '0.4s' }}>.</span>
      </h1>

     
    </div>
  );
};

export default Loading;
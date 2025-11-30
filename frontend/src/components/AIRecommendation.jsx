import { useState, useRef, useEffect } from "react";
import { aiAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AIRecommendation() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Mesaj geldiğinde otomatik aşağı kaydırmak için ref
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((c) => [...c, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await aiAPI.chat({ message, conversationHistory: chat });
      const aiMsg = {
        role: "ai",
        text: res.data.data.message,
        recommendations: res.data.data.recommendations || [],
      };
      setChat((c) => [...c, aiMsg]);
    } catch (err) {
      setChat((c) => [...c, { role: "ai", text: "Üzgünüm, bir bağlantı hatası oluştu." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. ANA ARKA PLAN: Koyu kömür/siyah ton (#09090b)
    <div className="relative min-h-screen w-full font-sans bg-[#09090b] overflow-hidden flex flex-col items-center pt-24 px-4 pb-10">
      
      {/* Arka Plan Süslemeleri (Gri ve Metalik) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 2. WRAPPER & GLOW (Işık Efekti - KORUNDU) */}
      <div className="relative w-full max-w-4xl z-10 group">
        
        {/* Arkadan Vuran Pembemsi/Mor Işık */}
        <div className="absolute -inset-[20px] rounded-[40px] bg-gradient-to-tr from-pink-600/40 via-purple-500/30 to-indigo-600/40 blur-3xl opacity-60 -z-10 pointer-events-none transition-all duration-500 group-hover:opacity-90 group-hover:blur-[40px]"></div>

        {/* 3. ANA KUTU (Senin İstediğin Glassmorphism Tasarım) */}
        <div className="relative z-10 w-full max-w-4xl bg-black/70 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
          
         {/* Header Kısmı */}
<div className="p-6 border-b border-white/10 bg-black/40 flex items-center justify-center">
  
  {/* İçerik Kutusu (text-center ile içindeki her şeyi ortalar) */}
  <div className="text-center">
    
    <h1 className="text-2xl font-bold text-white">
      {/* Yıldız */}
      <span className="text-2xl mr-2">✨</span>
      {/* Başlık */}
      AI Recommendation
    </h1>

    <p className="text-zinc-400 text-sm mt-1">
      Merhaba <span className="text-white font-medium">{user?.name}</span>, bugün ne izlemek istersin?
    </p>

  </div>
</div>

          {/* 3. CHAT ALANI */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {chat.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>Bir film türü veya ruh hali yazarak sohbete başla...</p>
              </div>
            )}

            {chat.map((m, i) => (
              <div
                key={i}
                className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-md backdrop-blur-sm text-sm md:text-base leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none" // User: Login butonu tarzı gradient
                      : "bg-zinc-900/80 border border-white/10 text-zinc-100 rounded-bl-none" // AI: Login input tarzı koyu stil
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* Eğer öneriler varsa burada kart olarak gösterebiliriz */}
                  {m.recommendations && m.recommendations.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                          {/* Örnek gösterim, backend verisine göre düzenlenebilir */}
                          {m.recommendations.map((rec, idx) => (
                              <div key={idx} className="bg-black/40 p-2 rounded border border-white/5 text-xs">
                                  {rec.title || "Film Önerisi"}
                              </div>
                          ))}
                      </div>
                  )}
                </div>
              </div>
            ))}

            {/* Yükleniyor Animasyonu */}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-zinc-900/80 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-2 items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 4. INPUT ALANI */}
          <div className="p-4 bg-black/40 border-t border-white/10">
            <form onSubmit={send} className="relative flex items-center gap-3">
              
              <input
                className="flex-1 bg-zinc-900/50 text-white pl-5 pr-5 py-4 rounded-xl border border-white/10 
                          focus:bg-zinc-900 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 
                          transition-all duration-300 placeholder-zinc-300 shadow-inner"
                placeholder="Bilim kurgu severim, şaşırtıcı sonlu bir film öner..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              
              <button 
    type="submit" 
    disabled={loading || !message.trim()}
    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 
               text-white p-4 rounded-xl shadow-[0_4px_14px_0_rgba(192,38,211,0.35)] 
               hover:shadow-[0_6px_20px_rgba(219,39,119,0.3)] hover:scale-105 active:scale-95 
               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
>
    {/* Yeni İkon: Modern Send */}
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
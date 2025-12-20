import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  // Form verileri için state'ler
  const [name, setName] = useState(user?.name || "");
  const [genres, setGenres] = useState(user?.preferences?.genres?.join(", ") || "");
  const [msg, setMsg] = useState("");
  
  // YENİ: Kaydetme işlemi sırasındaki yükleme durumu
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setLoading(true); // 1. Yüklemeyi başlat (Ekran kararır, çark döner)

    try {
      const res = await updateUser({
        name,
        preferences: {
          ...user.preferences,
          genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
        },
      });
      setMsg(res.success ? "Profil başarıyla güncellendi!" : res.message);
    } catch (error) {
      setMsg("Bir hata oluştu.");
    } finally {
      setLoading(false); // 2. İşlem bitince (başarılı veya hatalı) yüklemeyi durdur
    }
  };

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto min-h-screen">
      
      {/* YENİ: Yükleme ekranı buraya konur. Eğer loading true ise tüm ekranı kaplar. */}
      {loading && <Loading />}

      <h1 className="text-3xl font-bold mb-6 text-white">Profil Ayarları</h1>

      {msg && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msg.includes("başarıyla") ? "bg-green-500/20 text-green-200 border border-green-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={save} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
          <input
            className="w-full bg-[#141414] border border-gray-700 p-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Favori Türler <span className="text-xs text-gray-500">(Virgülle ayırın: Aksiyon, Dram)</span>
          </label>
          <input
            className="w-full bg-[#141414] border border-gray-700 p-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="Örn: Bilim Kurgu, Komedi"
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
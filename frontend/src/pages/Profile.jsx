import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [genres, setGenres] = useState(user?.preferences?.genres?.join(", ") || "");
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    const res = await updateUser({
      name,
      preferences: {
        ...user.preferences,
        genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
      },
    });
    setMsg(res.success ? "Kaydedildi!" : res.message);
  };

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      {msg && (
        <div className="bg-white/10 p-2 rounded mb-3 text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={save} className="space-y-3">
        <label className="block text-sm text-white/70">İsim</label>
        <input
          className="w-full bg-netflix-gray p-3 rounded outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm text-white/70">
          Favori türler (virgülle)
        </label>
        <input
          className="w-full bg-netflix-gray p-3 rounded outline-none"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />

        <button className="bg-netflix-red px-4 py-2 rounded font-semibold">
          Kaydet
        </button>
      </form>
    </div>
  );
}

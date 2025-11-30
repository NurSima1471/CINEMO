import { useState } from "react";
import { moviesAPI } from "../services/api";

export default function SearchBar({ onResults }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await moviesAPI.search(q);
      onResults?.(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={search} className="px-6 my-6">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-netflix-gray px-4 py-2 rounded outline-none"
          placeholder="Film ara..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="bg-netflix-red px-4 py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Aranıyor..." : "Ara"}
        </button>
      </div>
    </form>
  );
}

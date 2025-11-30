import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH ---
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// --- MOVIES ---
export const moviesAPI = {
  getTrending: () => api.get("/movies/trending"),
  getPopular: () => api.get("/movies/popular"),
  getTopRated: () => api.get("/movies/top-rated"),
  getSeries: () => api.get("/movies/series"),
  getDetail: (id) => api.get(`/movies/${id}`),
  search: (q) => api.get(`/movies/search?q=${encodeURIComponent(q)}`),
};

// --- RECOMMENDATIONS ---
export const recommendationsAPI = {
  getHybrid: () => api.get("/recommendations/hybrid"),
  getContentBased: (movieId) =>
    api.get(`/recommendations/content/${movieId}`),
  getGenreBased: (genres) =>
    api.post("/recommendations/genre", { genres }),
  getPopular: () => api.get("/recommendations/popular"),
};

// --- AI (Gemini) ---
export const aiAPI = {
  recommend: (payload) => api.post("/ai/recommend", payload),
  updateProfile: (payload) => api.post("/ai/update-profile", payload),
  chat: (payload) => api.post("/ai/chat", payload),
  analyze: (payload) => api.post("/ai/analyze", payload),
  trends: () => api.get("/ai/trends"),
};

export default api;

 
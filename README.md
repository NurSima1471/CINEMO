# 🎬 CINEMATCH - Film & Dizi Öneri Platformu

Netflix benzeri modern arayüze sahip, AI destekli gelişmiş film ve dizi öneri platformu.

## 🌟 Özellikler

### ✅ Tamamlanmış Özellikler
- 🎨 **Netflix Benzeri Modern Arayüz**
  - Responsive tasarım (mobile, tablet, desktop)
  - Smooth animasyonlar ve hover efektleri
  - Dark theme
  
- 🔐 **Kullanıcı Yönetimi**
  - JWT tabanlı authentication
  - Kayıt olma ve giriş yapma
  - Profil yönetimi
  
- 🎥 **Film & Dizi Özellikleri**
  - TMDB API entegrasyonu
  - Trend içerikler
  - Popüler filmler ve diziler
  - En iyi puanlananlar
  - Detaylı film/dizi sayfası
  - Arama fonksiyonu
  
- 🤖 **AI Öneri Sistemi (Hazır Entegrasyon)**
  - Kişiselleştirilmiş öneriler
  - İçerik bazlı öneriler
  - Hibrit öneri sistemi
  - AI chat arayüzü (frontend hazır)
  - AI API endpoint'leri (backend hazır)

### 🚧 Ekip Arkadaşlarınız İçin Hazır
- `/api/ai/*` endpoint'leri AI model entegrasyonu için hazır
- Frontend'te AI chat arayüzü mevcut
- Doğal dil işleme için altyapı hazır

## 📁 Proje Yapısı

```
movie-recommendation-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database ve TMDB ayarları
│   │   ├── models/          # MongoDB şemaları
│   │   ├── routes/          # API route'ları
│   │   ├── controllers/     # İş mantığı
│   │   ├── middleware/      # Auth ve error handling
│   │   ├── services/        # TMDB ve öneri servisleri
│   │   └── server.js        # Ana server dosyası
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/      # React componentleri
    │   ├── pages/          # Sayfa componentleri
    │   ├── services/       # API servisleri
    │   ├── context/        # React Context (Auth)
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+ 
- MongoDB (local veya Atlas)
- TMDB API Key

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd movie-recommendation-platform
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
JWT_SECRET=super_secret_key_change_this
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
NODE_ENV=development
```

Backend'i başlatın:
```bash
npm run dev
```

### 3. Frontend Kurulumu

```bash
cd ../frontend
npm install
```

`.env` dosyası oluşturun:
```env
VITE_API_URL=http://localhost:5000/api
```

Frontend'i başlatın:
```bash
npm run dev
```

## 🔑 TMDB API Key Alma

1. [TMDB](https://www.themoviedb.org/) sitesine gidin
2. Hesap oluşturun
3. Settings > API > Create > Developer > Accept Terms
4. API Key'i kopyalayın ve `.env` dosyasına ekleyin

## 📡 API Endpoint'leri

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgisi
- `PUT /api/auth/profile` - Profil güncelleme

### Movies
- `GET /api/movies/trending` - Trend içerikler
- `GET /api/movies/popular` - Popüler filmler
- `GET /api/movies/series` - Popüler diziler
- `GET /api/movies/top-rated` - En iyi puanlananlar
- `GET /api/movies/:id` - Film/dizi detayı
- `GET /api/movies/search?query=...` - Arama
- `POST /api/movies/:id/rate` - Puanlama

### Recommendations
- `GET /api/recommendations/personalized` - Kişiselleştirilmiş
- `GET /api/recommendations/similar/:movieId` - Benzer içerikler
- `GET /api/recommendations/popular` - Popüler öneriler
- `GET /api/recommendations/hybrid` - Hibrit öneriler

### AI (Entegrasyon için hazır)
- `POST /api/ai/recommend` - AI tabanlı öneri
- `POST /api/ai/chat` - Doğal dil ile öneri
- `POST /api/ai/update-profile` - AI profil güncelleme
- `POST /api/ai/analyze` - İçerik analizi
- `GET /api/ai/trends` - Trend analizi

## 🤖 AI Entegrasyonu Rehberi

### Backend - AI Controller (`backend/src/controllers/aiController.js`)

Şu endpoint'ler hazır ve mock response dönüyor:

```javascript
// 1. AI Öneri Sistemi
POST /api/ai/recommend
Body: {
  userPreferences: {...},
  watchHistory: [...],
  mood: "action",
  genres: ["Action", "Sci-Fi"],
  limit: 10
}

// 2. Chat Tabanlı Öneri
POST /api/ai/chat
Body: {
  message: "Matrix gibi filmler öner",
  conversationHistory: [...]
}

// 3. İçerik Analizi
POST /api/ai/analyze
Body: {
  movieId: 603,
  type: "movie"
}
```

### Frontend - AI Component (`frontend/src/components/AIRecommendation.jsx`)

UI hazır, sadece AI response'ları entegre edilmeli.

### Entegrasyon Adımları

1. **AI Model Seçimi**
   - OpenAI GPT
   - Hugging Face Models
   - Custom ML Model (TensorFlow/PyTorch)

2. **Backend Entegrasyonu**
   ```javascript
   // backend/src/controllers/aiController.js içinde
   const response = await yourAIModel.predict({
     userPreferences,
     watchHistory,
     mood
   });
   ```

3. **Environment Variables**
   ```env
   AI_MODEL_URL=your_model_endpoint
   AI_MODEL_API_KEY=your_api_key
   ```

## 🎨 Teknolojiler

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Axios (TMDB API)
- Bcrypt (Password hashing)
- Express Rate Limit
- Helmet (Security)

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (Icons)
- Vite (Build tool)

## 📱 Ekran Görüntüleri

### Ana Sayfa
- Hero section (büyük banner)
- Kişiselleştirilmiş öneriler
- Trend içerikler
- Popüler filmler/diziler
- Kategori satırları

### AI Öneri Ekranı
- Chat arayüzü
- Hızlı başlangıç prompts
- Real-time sohbet

### Film Detay
- Büyük backdrop image
- Film bilgileri
- Puanlama
- Benzer içerikler

## 🔒 Güvenlik

- JWT token based authentication
- Password hashing (bcrypt)
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation

## 📈 Performans

- Lazy loading images
- Code splitting
- Optimized API calls
- MongoDB indexing
- Response caching (ileride)

## 🐛 Sorun Giderme

### TMDB API Hatası
```bash
# .env dosyasında API key'i kontrol edin
TMDB_API_KEY=your_correct_api_key
```

### MongoDB Bağlantı Hatası
```bash
# MongoDB'nin çalıştığından emin olun
mongod

# Veya MongoDB Atlas kullanıyorsanız URI'yi kontrol edin
```

### Port Çakışması
```bash
# Backend için farklı port
PORT=5001

# Frontend için farklı port (vite.config.js)
server: { port: 3001 }
```

## 🤝 Takım İçin Notlar

### AI Ekibi İçin
1. `backend/src/controllers/aiController.js` dosyasındaki mock response'ları değiştirin
2. Environment variables ekleyin
3. Model entegrasyonunu yapın
4. Frontend otomatik olarak çalışacak

### Frontend Ekibi İçin
- Tüm component'ler hazır
- API servisleri entegre
- Sadece styling değişiklikleri yapılabilir

### Backend Ekibi İçin
- CRUD operasyonları hazır
- Authentication sistem aktif
- Yeni endpoint eklemek için route/controller pattern takip edin

## 📝 TODO

- [ ] AI Model Entegrasyonu
- [ ] Film/dizi izleme sayfası
- [ ] Kullanıcı watchlist
- [ ] Film yorumlama sistemi
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Admin panel
- [ ] Analytics dashboard

## 📄 Lisans

MIT License

## 👥 İletişim

Sorularınız için: [email@example.com]

---

**Not:** Bu proje code-first yaklaşımla hazırlanmıştır. Tüm dosyalar production-ready durumdadır. AI entegrasyonu için endpoint'ler ve UI hazırdır.
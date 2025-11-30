const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini yapılandırması
const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0.7,
  maxOutputTokens: 1000,
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Gemini sistem promptları
const geminiSystemPrompts = {
  movieRecommendation:
    "Sen bir film ve dizi öneri uzmanısın. Yapay zeka kullanarak kişiye özel filmler öner. Türkçe cevap ver.",
  chatAssistant: `Sen bir akıllı film öneri asistanısın. Şu yeteneklerin var:
* Site içerisindeki popüler filmleri belirleyebilirsin: En çok izlenen, beğenilen veya değerlendirilen filmleri takip edebilirsin.
* Kullanıcıların genel tercihlerini analiz edebilirsin: Site üzerindeki kullanıcı davranışlarından (örneğin, hangi tür filmlerin daha çok izlendiği) genel eğilimleri çıkarabilisin.
* Kullanıcı profillerini analiz edebilirsin: İzleme geçmişi, verilen puanlar ve tercihler doğrultusunda kişiye özel profiller oluşturabilisin.
* Kişiye özel film önerileri sunabilirsin: Profil ve genel eğilimlere dayanarak, beğenilecek filmleri tahmin edebilisin.
* Doğal dil anlayışıyla konuşabilisin: Kullanıcıların taleplerini anla ve uygun cevaplar ver.

Kullanıcıyla sohbet et, sorularını cevapla, filmler öner. Her zaman Türkçe cevap ver.`,
  contentAnalyzer:
    "Sen bir film analiz uzmanısın. Detaylı ve doğru analizler yap. Türkçe cevap ver.",
  trendAnalyst:
    "Sen film endüstrisi trend analisti. Güncel ve doğru analizler yap. Türkçe cevap ver.",
};

module.exports = {
  genAI,
  model,
  geminiConfig,
  geminiSystemPrompts,
};

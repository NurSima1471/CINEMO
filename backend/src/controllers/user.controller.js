const User = require("../models/User");

// --- 1. FONKSİYON: Profil Getir (Watchlist'i görmek için lazım) ---
exports.getProfile = async (req, res) => {
  try {
    // req.user.id, auth middleware'den (verifyToken) gelir
    const user = await User.findById(req.user.id).select("-password"); // Şifreyi gönderme

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({
      success: true,
      data: user, // İçinde watchlist array'i de olacak
    });
  } catch (error) {
    console.error("Profil hatası:", error);
    res.status(500).json({ success: false, message: "Profil hatası" });
  }
};

// --- 2. FONKSİYON: Listeye Ekle / Çıkar (Toggle) ---
exports.toggleWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    let { tmdbId, title, posterPath, voteAverage } = req.body;

    // --- KRİTİK GÜVENLİK KONTROLÜ ---
    // Eğer frontend'den tmdbId boş veya 'NaN' gelirse işlemi durdur.
    // Bu sayede sunucunun çökmesini engelleriz.
    if (!tmdbId || isNaN(Number(tmdbId))) {
      return res.status(400).json({ 
        success: false, 
        message: "Geçersiz Film ID. Veri okunamadı." 
      });
    }
    // -------------------------------

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    // Gelen ID'yi sayıya çevir
    const movieIdNum = Number(tmdbId);

    // Listede var mı kontrol et
    const existingIndex = user.watchlist.findIndex(
      (item) => item.tmdbId === movieIdNum
    );

    if (existingIndex > -1) {
      // --- VARSA LİSTEDEN SİL (REMOVE) ---
      user.watchlist.splice(existingIndex, 1);
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: "Listeden çıkarıldı",
        watchlist: user.watchlist
      });
    } else {
      // --- YOKSA LİSTEYE EKLE (ADD) ---
      user.watchlist.push({
        tmdbId: movieIdNum,
        title,
        posterPath,
        // Puan yoksa veya hatalıysa varsayılan olarak 0 ver
        voteAverage: Number(voteAverage) || 0 
      });
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Listeye eklendi",
        watchlist: user.watchlist
      });
    }

  } catch (error) {
    console.error("Watchlist Hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};
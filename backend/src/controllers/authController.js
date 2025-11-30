const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');

// Token oluştur
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kullanıcı kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu email zaten kullanımda'
      });
    }

    // Kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
    }

    // Kullanıcı kontrolü
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        subscription: user.subscription,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Kullanıcı profili
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Profil güncelleme
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, preferences },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Kullanıcının izleme geçmişine film ekle
// @route   POST /api/auth/me/watch
// @access  Private
exports.addWatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdbId, title } = req.body;

    if (!tmdbId && !title) {
      return res.status(400).json({ success: false, message: 'tmdbId veya title gereklidir' });
    }

    // Movie varsa DB'den al, yoksa TMDB'den detay çek ve kaydet
    let movieDoc = null;
    if (tmdbId) {
      movieDoc = await Movie.findOne({ tmdbId });
      if (!movieDoc) {
        try {
          movieDoc = await tmdbService.getMovieDetails(tmdbId);
        } catch (e) {
          // yoksa arama ile dene
          const search = await tmdbService.search(title || '');
          movieDoc = (search && search[0]) || null;
        }
      }
    } else if (title) {
      const search = await tmdbService.search(title);
      movieDoc = (search && search[0]) || null;
    }

    if (!movieDoc) {
      return res.status(404).json({ success: false, message: 'Film bulunamadı' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });

    const existing = (user.watchHistory || []).find((w) => w.tmdbId === movieDoc.tmdbId);
    if (existing) {
      return res.json({ success: true, message: 'Film zaten izleme geçmişinde', data: user.watchHistory });
    }

    user.watchHistory.unshift({ tmdbId: movieDoc.tmdbId, title: movieDoc.title, watchedAt: new Date() });
    user.watchHistory = user.watchHistory.slice(0, 200); // maksimum 200 kaydı tut
    await user.save();

    return res.json({ success: true, message: 'İzleme geçmişine eklendi', data: user.watchHistory });
  } catch (error) {
    console.error('AddWatch Error:', error.message || error);
    return res.status(500).json({ success: false, message: error.message || 'Eklenemedi' });
  }
};

// @desc    Kullanıcının izleme geçmişinden film çıkar
// @route   DELETE /api/auth/me/watch/:tmdbId
// @access  Private
exports.removeWatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const tmdbId = Number(req.params.tmdbId);
    if (!tmdbId) return res.status(400).json({ success: false, message: 'tmdbId gereklidir' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });

    user.watchHistory = (user.watchHistory || []).filter((w) => w.tmdbId !== tmdbId);
    await user.save();

    return res.json({ success: true, message: 'İzleme geçmişinden çıkarıldı', data: user.watchHistory });
  } catch (error) {
    console.error('RemoveWatch Error:', error.message || error);
    return res.status(500).json({ success: false, message: error.message || 'Silinemedi' });
  }
};
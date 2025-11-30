const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { addWatch, removeWatch } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/me/watch', protect, addWatch);
router.delete('/me/watch/:tmdbId', protect, removeWatch);

module.exports = router;
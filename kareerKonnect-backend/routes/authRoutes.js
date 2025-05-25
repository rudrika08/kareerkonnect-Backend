const express = require('express');
const router = express.Router();

const {
  login,
  register,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
} = require('../controllers/authController');

const {verifyOTP} = require('../controllers/verifyOTPController');
const { requireLogin, isAdmin } = require('../middleware/auth');

// Register new user
router.post('/register', register);

// Login
router.post('/login', login);

// Refresh JWT token
router.post('/refresh-token', refreshToken);

// Get logged-in user's profile
router.get('/me', requireLogin, getUserProfile);

// Update user's name/email
router.put('/me', requireLogin, updateUserProfile);

// Update user's password
router.put('/me/password', requireLogin, updateUserPassword);

// Delete user's account
router.delete('/me', requireLogin, deleteUserAccount);

// Admin-only route example: Only admins can access this
router.get('/admin-only', requireLogin, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});
// routes/auth.js
router.post('/verify-otp', verifyOTP);

module.exports = router;

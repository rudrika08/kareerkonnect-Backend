const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkLogin, checkAdmin } = require('../middleware/authMiddleware');

// Utility function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST / - Create user and send OTP
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = generateOTP();
    const newUser = new User({
      name,
      email,
      password, // NOTE: You should hash this in production
      otp,
      isVerified: false,
      role: role || 'user'
    });

    await newUser.save();
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: 'User created. Please verify OTP sent to your email.',
      userId: newUser._id
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /verify-otp - Verify OTP for a user
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      return res.json({ message: 'User verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET / - Return all verified users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isVerified: true }).select('-password -otp');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admins - Return all verified admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ isVerified: true, role: 'admin' }).select('-password -otp');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /make-admin/:id - Promote a user to admin (protected route)
router.patch('/make-admin/:id', checkLogin, checkAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Utility function to generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST / - Create user and send OTP for verification
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const otp = generateOTP();
        // Create user with OTP and isVerified false
        const newUser = new User({ name, email, password, otp, isVerified: false });
        await newUser.save();

        // Simulate sending OTP via console log - replace with email/SMS in production
        console.log(`OTP for user ${email}: ${otp}`);

        res.status(201).json({ message: 'User created. Please verify OTP sent to your email.', userId: newUser._id });
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
            user.otp = null; // Clear OTP after verification
            await user.save();
            return res.json({ message: 'User verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET / - Return only verified users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select('-password -otp'); // exclude sensitive fields
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;


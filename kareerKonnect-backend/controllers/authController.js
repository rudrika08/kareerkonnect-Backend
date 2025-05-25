const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOTPToEmail = require('../utils/sendOtp');

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Login error: Missing email or password");
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error("Login error: User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error("Login error: Password mismatch for user:", email);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log(`✅ Login successful for ${email}`);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// Register Controller
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    console.error("Registration error: Missing fields");
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser && existingUser.isVerified) {
      console.error("Registration error: Email already registered and verified:", email);
      return res.status(409).json({ error: "Email already registered." });
    }

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.role = role || 'user';
      await existingUser.save();
      console.log("🔄 Updated unverified user:", email);
    } else {
      const newUser = new User({
        name,
        email,
        password,
        otp,
        role: role || 'user',
      });
      await newUser.save();
      console.log("🆕 New user registered:", email);
    }

    await sendOTPToEmail(email, otp);
    console.log(`📧 OTP sent to ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent to your email. Please verify to complete registration." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// Refresh JWT Token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error("Update user profile error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// Update User Password
exports.updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid current password." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update user password error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// Delete User Account
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json({ message: "User account deleted successfully." });
  } catch (err) {
    console.error("Delete user account error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });

  try {
    const user = await User.findOne({ email });

    if (!user || user.isVerified)
      return res.status(400).json({ error: "Invalid request or already verified." });

    if (user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP." });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "Server error." });
  }
};


const checkLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Admin access required' });
  }
};

module.exports = {
  checkLogin,
  checkAdmin,
};

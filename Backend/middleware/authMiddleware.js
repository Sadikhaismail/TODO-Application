const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.user = { id: decoded.id }; 
    next(); 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
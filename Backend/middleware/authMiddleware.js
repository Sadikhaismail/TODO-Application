// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    req.user = { id: decoded.id }; // Attach user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    // Handle expired or invalid token error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

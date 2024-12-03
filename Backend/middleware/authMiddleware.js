const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Step 1: Extract the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];


  // Step 2: If no token is provided, return an error response
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Step 3: Check if the token format is correct (starts with 'Bearer ')
  if (!req.header("Authorization")?.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token format is incorrect" });
  }

  // Step 4: Verify the token using the secret key
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach the decoded user data to the request object
    req.user = { id: decoded.id };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Step 6: Handle invalid token errors
    console.error(error);  // Optional: log the error for debugging
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

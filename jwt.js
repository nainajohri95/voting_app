const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT tokens
const jwtAuthMiddleware = (req, res, next) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization.split(" ")[1]; // Split the "Bearer <token>" string
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  // Generate a new JWT token using user data
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { jwtAuthMiddleware, generateToken };

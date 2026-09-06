// middleware/authMiddleware.js
// Verifies JWT token and attaches logged-in user to the request object

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers (Format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user by id in decoded token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 4. Continue to next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
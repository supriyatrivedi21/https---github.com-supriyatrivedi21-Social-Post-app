// routes/authRoutes.js
// Authentication routes mapping to authController

const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Route: POST /api/auth/signup
// Register a new user
router.post("/signup", signup);

// Route: POST /api/auth/login
// Log in an existing user
router.post("/login", login);

module.exports = router;
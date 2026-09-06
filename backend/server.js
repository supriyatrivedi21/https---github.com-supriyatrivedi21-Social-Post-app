// server.js
// Main entry point for the Social Post Backend API

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 1. Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Initialize Express app
const app = express();

// 4. Global Middlewares
app.use(cors()); // Allow requests from any frontend URL
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 5. Serve uploaded images as static files
// Example: http://localhost:5000/uploads/1720000-photo.png can be opened in browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6. Mount API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// 7. Root Route (Health check)
app.get("/", (req, res) => {
  res.json({ message: "🚀 Social Post API is running smoothly!" });
});

// 8. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
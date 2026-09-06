// routes/postRoutes.js
// Post routes including Multer configuration for image uploads

const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ─────────────────────────────────────────────
// MULTER CONFIGURATION (For Image Uploads)
// ─────────────────────────────────────────────

// Define where and how to save uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to the 'uploads' folder we created earlier
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname.png
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

// Only allow image files (jpeg, jpg, png, gif, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

// Initialize multer with config (max file size: 5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// Route: GET /api/posts?page=1&limit=10
// Get all posts for public feed (No auth required)
router.get("/", getPosts);

// Route: POST /api/posts/create
// Create new post with optional image (Auth required)
// upload.single('image') means frontend must send file with field name "image"
router.post("/create", protect, upload.single("image"), createPost);

// Route: PUT /api/posts/:id/like
// Like or unlike a post (Auth required)
router.put("/:id/like", protect, toggleLike);

// Route: POST /api/posts/:id/comment
// Add a comment to a post (Auth required)
router.post("/:id/comment", protect, addComment);

module.exports = router;
// controllers/postController.js
// Handles Create Post, Feed with Pagination, Toggle Like, and Comments

const Post = require("../models/Post");

// @desc    Create a new post (text, image, or both)
// @route   POST /api/posts/create
// @access  Private (Requires Login)
const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // Get image path if file was uploaded through multer
    let image = "";
    if (req.file) {
      // Normalize slashes for cross-platform compatibility
      image = `/uploads/${req.file.filename}`;
    }

    // Validation: At least one field (text or image) must be present
    if (!text && !image) {
      return res.status(400).json({
        message: "Please provide either text or an image for your post",
      });
    }

    // Create post in database
    const newPost = await Post.create({
      userId: req.user._id,
      userName: req.user.name,
      text: text ? text.trim() : "",
      image: image,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (public feed) with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Public
const getPosts = async (req, res) => {
  try {
    // Pagination parameters (defaults: page 1, 10 posts per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts: newest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count for frontend pagination control
    const totalPosts = await Post.countDocuments();

    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Unlike a post (toggle)
// @route   PUT /api/posts/:id/like
// @access  Private (Requires Login)
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if current user already liked this post
    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (alreadyLikedIndex !== -1) {
      // 1. UNLIKE: Remove user from likes array
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // 2. LIKE: Add user to likes array
      post.likes.push({
        userId: req.user._id,
        userName: req.user.name,
      });
    }

    // Update the counter
    post.likesCount = post.likes.length;

    await post.save();

    res.json({
      message: alreadyLikedIndex !== -1 ? "Post unliked" : "Post liked",
      likesCount: post.likesCount,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private (Requires Login)
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create comment object
    const newComment = {
      userId: req.user._id,
      userName: req.user.name,
      text: text.trim(),
      createdAt: new Date(),
    };

    // Push to post's comments array
    post.comments.push(newComment);

    // Update counter
    post.commentsCount = post.comments.length;

    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      commentsCount: post.commentsCount,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
};
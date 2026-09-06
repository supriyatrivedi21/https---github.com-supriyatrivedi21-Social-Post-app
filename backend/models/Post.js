// models/Post.js
// Post schema with embedded likes and comments

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // Author of the post
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },

    // Post content (at least one will be present)
    text: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "", // Stores image URL/path
    },

    // Embedded array of users who liked this post
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: {
          type: String,
        },
      },
    ],

    // Embedded array of comments on this post
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Cached counts for quick display in feed
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model("Post", postSchema);
// src/components/CommentSection.js
// Displays list of comments and input field to add new comments

import React, { useState } from "react";
import API from "../api/axios";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId, comments = [], onCommentAdded }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendComment = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please log in to comment.");
      return;
    }

    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await API.post(`/api/posts/${postId}/comment`, {
        text: text.trim(),
      });

      // Clear input
      setText("");

      // Notify parent PostCard with updated comments & count
      if (onCommentAdded) {
        onCommentAdded(response.data.comments, response.data.commentsCount);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>
          {error}
        </Alert>
      )}

      {/* List of Comments */}
      {comments.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {comments.map((comment, index) => (
            <Box
              key={comment._id || index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
              }}
            >
              {/* User Avatar */}
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.8rem",
                  bgcolor: "secondary.main",
                  mt: 0.5,
                }}
              >
                {comment.userName ? comment.userName.charAt(0).toUpperCase() : "U"}
              </Avatar>

              {/* Comment Bubble */}
              <Box
                sx={{
                  bgcolor: "#f5f6f8",
                  borderRadius: 2,
                  px: 1.8,
                  py: 1,
                  maxWidth: "85%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="700" color="text.primary">
                    {comment.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.createdAt ? formatDate(comment.createdAt) : ""}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.3 }}>
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}

      {/* Add Comment Input */}
      {user ? (
        <Box
          component="form"
          onSubmit={handleSendComment}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.85rem",
              bgcolor: "primary.main",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: "#fafafa",
              },
            }}
          />

          <IconButton
            type="submit"
            color="primary"
            disabled={loading || !text.trim()}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              "&:hover": { bgcolor: "primary.dark" },
              "&.Mui-disabled": { bgcolor: "#e0e0e0", color: "#9e9e9e" },
              width: 38,
              height: 38,
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon fontSize="small" />}
          </IconButton>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Log in to leave a comment.
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;
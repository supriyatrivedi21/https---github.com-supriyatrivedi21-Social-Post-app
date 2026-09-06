// src/components/CreatePost.js
// Post creation form with optional image upload and preview

import React, { useState } from "react";
import API from "../api/axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle image selection + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
    document.getElementById("post-image-input").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: either text or image required
    if (!text.trim() && !image) {
      setError("Please enter some text or upload an image.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image); // matches multer field name

    try {
      await API.post("/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear form after success
      setText("");
      setImage(null);
      setPreview("");
      document.getElementById("post-image-input").value = "";

      // Notify parent feed to refresh
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      {/* User Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Typography fontWeight="600" color="text.primary">
          {user?.name || "Guest"}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Text Area */}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Image Preview */}
        {preview && (
          <Box sx={{ position: "relative", mb: 2, display: "inline-block" }}>
            <img
              src={preview}
              alt="preview"
              style={{ maxHeight: 200, borderRadius: 8, maxWidth: "100%" }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            component="label"
            startIcon={<ImageIcon />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Add Image
            <input
              id="post-image-input"
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {loading ? <CircularProgress size={20} /> : "Post"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;
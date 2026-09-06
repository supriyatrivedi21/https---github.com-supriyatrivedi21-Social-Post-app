// src/pages/Feed.js
// Main social feed page with post listing, creation, and pagination

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Feed = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts from backend with pagination
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const response = await API.get(`/api/posts?page=${pageNum}&limit=5`);

      if (append) {
        // Append new posts to existing list
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      } else {
        // Replace with first page of posts
        setPosts(response.data.posts);
      }

      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load feed. Make sure the backend server is running.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch initial posts on page load
  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // Handler when user creates a new post
  const handlePostCreated = () => {
    // Refresh feed to show the new post at the top
    fetchPosts(1, false);
  };

  // Handler to load more posts
  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchPosts(page + 1, true);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 6 }}>
      {/* Top Navigation */}
      <Navbar />

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* If user is logged in, show CreatePost form */}
        {user ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Join the Conversation!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Log in or sign up to create posts, like, and comment.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Log In
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Initial Loading Spinner */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length > 0 ? (
          <>
            {/* List of Posts */}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Pagination / Load More Button */}
            {page < totalPages && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {loadingMore ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Load More Posts"
                  )}
                </Button>
              </Box>
            )}

            {page >= totalPages && posts.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                sx={{ mt: 3 }}
              >
                🎉 You're all caught up!
              </Typography>
            )}
          </>
        ) : (
          /* Empty Feed State */
          <Paper
            elevation={1}
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No posts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first person to share a post!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Feed;
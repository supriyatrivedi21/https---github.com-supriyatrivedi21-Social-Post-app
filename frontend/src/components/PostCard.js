// src/components/PostCard.js
// Individual post card with like toggle, image display, and comments

import React, { useState } from "react";
import API from "../api/axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Collapse,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CommentSection from "./CommentSection";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post }) => {
  const { user } = useAuth();

  // Local states for instant UI updates
  const [likes, setLikes] = useState(post.likes || []);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Check if the logged-in user has liked this post
  const isLikedByMe = user && likes.some((like) => like.userId === user._id);

  // Handle Like / Unlike toggle
  const handleToggleLike = async () => {
    if (!user) {
      alert("Please log in to like posts!");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await API.put(`/api/posts/${post._id}/like`);
      // Update state instantly with response from server
      setLikes(response.data.likes);
      setLikesCount(response.data.likesCount);
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setIsLiking(false);
    }
  };

  // Callback when a new comment is added inside CommentSection
  const handleCommentAdded = (updatedComments, newCount) => {
    setComments(updatedComments);
    setCommentsCount(newCount);
  };

  // Format relative or friendly timestamp
  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Construct full image URL
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${backendUrl}${post.image}`
    : null;

  // Tooltip text showing names of people who liked
  const likedUsersText =
    likes.length > 0
      ? likes.map((l) => l.userName).slice(0, 5).join(", ") +
        (likes.length > 5 ? ` and ${likes.length - 5} others` : "")
      : "No likes yet";

  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 3, overflow: "hidden" }}>
      {/* Header: Avatar, Author, Timestamp */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
            {post.userName ? post.userName.charAt(0).toUpperCase() : "U"}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight="700">
            {post.userName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.createdAt)}
          </Typography>
        }
      />

      {/* Post Text Content */}
      {post.text && (
        <CardContent sx={{ pt: 0, pb: 1.5 }}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* Post Image Content */}
      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post attachment"
          sx={{
            maxHeight: 500,
            objectFit: "cover",
            width: "100%",
            bgcolor: "#f5f5f5",
          }}
        />
      )}

      {/* Like and Comment Counts */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2.5,
          pt: 1.5,
          color: "text.secondary",
        }}
      >
        <Tooltip title={likedUsersText} arrow>
          <Typography variant="caption" sx={{ cursor: "pointer" }}>
            ❤️ {likesCount} {likesCount === 1 ? "like" : "likes"}
          </Typography>
        </Tooltip>

        <Typography
          variant="caption"
          sx={{ cursor: "pointer" }}
          onClick={() => setShowComments(!showComments)}
        >
          💬 {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
        </Typography>
      </Box>

      {/* Action Buttons: Like & Comment Toggle */}
      <CardActions sx={{ px: 2, pt: 0.5, pb: 1, borderTop: "1px solid #f5f5f5", mt: 1 }}>
        <Tooltip title={isLikedByMe ? "Unlike" : "Like"}>
          <IconButton
            onClick={handleToggleLike}
            color={isLikedByMe ? "error" : "default"}
            size="small"
            sx={{ gap: 0.5 }}
          >
            {isLikedByMe ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            <Typography variant="body2" fontWeight="600" color={isLikedByMe ? "error" : "text.secondary"}>
              Like
            </Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="View Comments">
          <IconButton
            onClick={() => setShowComments(!showComments)}
            color="default"
            size="small"
            sx={{ gap: 0.5, ml: 1 }}
          >
            <ChatBubbleOutlineIcon />
            <Typography variant="body2" fontWeight="600" color="text.secondary">
              Comment
            </Typography>
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* Expandable Comment Section */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2.5, pb: 2 }}>
          <CommentSection
            postId={post._id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
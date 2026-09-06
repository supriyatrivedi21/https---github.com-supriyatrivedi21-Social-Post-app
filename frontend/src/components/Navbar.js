// src/components/Navbar.js
// Top Navigation bar with responsive layout and Auth controls

import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user's first initial for the avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <AppBar position="sticky" elevation={2} sx={{ bgcolor: "#ffffff", color: "#1976d2" }}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          
          {/* Logo & App Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              gap: 1,
            }}
          >
            <DynamicFeedIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 0.5,
              }}
            >
              TaskPlanet Social
            </Typography>
          </Box>

          {/* Right Side: User Details or Login/Signup */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                {/* User Profile Chip */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 36,
                      height: 36,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {userInitial}
                  </Avatar>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{
                      color: "text.primary",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>

                {/* Logout Button */}
                <Tooltip title="Log Out">
                  <IconButton
                    onClick={handleLogout}
                    color="error"
                    size="small"
                    sx={{
                      border: "1px solid",
                      borderColor: "error.light",
                      borderRadius: 2,
                      p: 0.8,
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // When user is not logged in
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Log In
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
// src/App.js
// Main App routing configuration with Auth Context Provider

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./context/AuthContext";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

// Custom Material UI Theme to match TaskPlanet aesthetics
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // TaskPlanet classic blue
      light: "#4791db",
      dark: "#115293",
    },
    secondary: {
      main: "#9c27b0", // Purple accent
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none", // Avoid aggressive ALL-CAPS buttons
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Main Public Feed */}
            <Route path="/" element={<Feed />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Fallback wildcard redirect to Feed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
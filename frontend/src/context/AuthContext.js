// src/context/AuthContext.js
// Manages global user authentication state across all components

import React, { createContext, useState, useContext, useEffect } from "react";
import API from "../api/axios";

// 1. Create Context
const AuthContext = createContext();

// 2. AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on initial page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ── Signup Action ──
  const signup = async (name, email, password) => {
    try {
      const response = await API.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      // Save user & token to state and localStorage
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed. Please try again.",
      };
    }
  };

  // ── Login Action ──
  const login = async (email, password) => {
    try {
      const response = await API.post("/api/auth/login", {
        email,
        password,
      });

      // Save user & token to state and localStorage
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password",
      };
    }
  };

  // ── Logout Action ──
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy access in other components
export const useAuth = () => {
  return useContext(AuthContext);
};
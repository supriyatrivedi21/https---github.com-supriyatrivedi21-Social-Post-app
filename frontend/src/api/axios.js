// src/api/axios.js
// Configures Axios with base URL and automatic JWT token attachment

import axios from "axios";

// 1. Create Axios instance with backend base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// 2. Request Interceptor: Attach JWT token to every request if user is logged in
API.interceptors.request.use(
  (config) => {
    // Get stored user data from localStorage
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        // Attach Bearer token to headers
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
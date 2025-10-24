import axios from "axios";

const API = axios.create({
  baseURL: "https://gym-pro-ddxr.onrender.com", // remove /auth
});

// Add token to headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;


// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// optional: interceptors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // optionally handle global errors here (401, 500, etc)
    return Promise.reject(error);
  }
);

export default api;

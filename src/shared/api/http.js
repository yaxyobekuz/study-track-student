// Axios
import axios from "axios";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

// Create an Axios instance
const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default http;

// ============ API Modules ============

export const authAPI = {
  register: (data) => http.post("/api/auth/register", data),
  login: (data) => http.post("/api/auth/login", data),
  getMe: () => http.get("/api/auth/me"),
};

export const usersAPI = {
  updateProfile: (data) => http.put("/api/users/me", data),
};

export const statisticsAPI = {
  getStudentWeekly: (studentId) =>
    http.get(`/api/statistics/weekly/current/${studentId}`),
};

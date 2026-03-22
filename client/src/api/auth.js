import axios from "axios";

// ✅ create axios instance (NOT string)
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// ✅ attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ================= AUTH =================

// Signup flow
export const requestOtp = (data) =>
  API.post("/request-otp", data);

export const verifyOtp = (data) =>
  API.post("/verify-otp", data);

export const registerUser = (data) =>
  API.post("/register", data);

// Login
export const loginUser = (data) =>
  API.post("/login", data);

// Forgot password
export const forgotPasswordOtp = (data) =>
  API.post("/forgot-password/request-otp", data);

export const resetPassword = (data) =>
  API.post("/forgot-password/verify-otp", data);

// Profile
export const getProfile = () =>
  API.get("/profile");
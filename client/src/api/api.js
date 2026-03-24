import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ FIXED
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ================= AUTH =================
export const requestOtp = (data) =>
  API.post("/auth/request-otp", data);

export const verifyOtp = (data) =>
  API.post("/auth/verify-otp", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const forgotPasswordOtp = (data) =>
  API.post("/auth/forgot-password/request-otp", data);

export const resetPassword = (data) =>
  API.post("/auth/forgot-password/verify-otp", data);

// ================= PROFILE =================
export const getProfile = () =>
  API.get("/user/profile");

// ================= DISCOVER =================
export const getMatches = () =>
  API.get("/user/match"); // ✅ NEW

export const likeUser = (id) =>
  API.post(`/user/like/${id}`);

export const skipUser = (id) =>
  API.post(`/user/skip/${id}`);

// ================= MATCHES =================

export const getMatchesList = () =>
  API.get("/user/matches");

export default API;
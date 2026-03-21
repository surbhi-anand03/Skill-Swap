import axios from "axios";

const API = "http://localhost:5000/api/auth";

// Signup flow
export const requestOtp = (data) =>
  axios.post(`${API}/request-otp`, data);

export const verifyOtp = (data) =>
  axios.post(`${API}/verify-otp`, data);

export const registerUser = (data) =>
  axios.post(`${API}/register`, data);

// Login
export const loginUser = (data) =>
  axios.post(`${API}/login`, data);

// Forgot password
export const forgotPasswordOtp = (data) =>
  axios.post(`${API}/forgot-password/request-otp`, data);

export const resetPassword = (data) =>
  axios.post(`${API}/forgot-password/verify-otp`, data);
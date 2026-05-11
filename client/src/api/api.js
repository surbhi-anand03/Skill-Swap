import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= TOKEN INTERCEPTOR =================
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
  API.get("/user/discover"); // ✅ correct endpoint

export const likeUser = (id) =>
  API.post(`/user/like/${id}`);

export const skipUser = (id) =>
  API.post(`/user/skip/${id}`);

// ================= MATCHES =================
export const getMatchesList = () =>
  API.get("/user/matches");

// ================= REQUESTS =================

// ✅ SEND / RESEND REQUEST
export const sendRequest = (id) =>
  API.post("/request/send", { receiverId: id });

export const getSkippedRequests = () =>
  API.get("/request/skipped");

// ✅ RESPOND (accept / ignore / skip)
export const respondRequest = (requestId, action) =>
  API.post("/request/respond", { requestId, action });


export const getAllRequests = async () => {
  const [incoming, pending] = await Promise.all([
    API.get("/request/incoming"),
    API.get("/request/pending"),
  ]);

  return {
    data: {
      incoming: (incoming.data || []).filter(
        (req) => req.status === "pending"
      ),
      pendingSent: (pending.data || []).filter(
        (req) => req.status === "pending"
      ),
    },
  };
};


// 🔹 OPTIONAL APIs (only if you want separate calls)
export const getIncomingRequests = () =>
  API.get("/request/incoming");

export const getSentRequests = () =>
  API.get("/request/pending");

export const createSession = (data) =>
  API.post("/session/create", data);

export const acceptSession = (id) =>
  API.patch(`/session/${id}/accept`);

export const rejectSession = (id) =>
  API.patch(`/session/${id}/reject`);

export const getSessions = () =>
  API.get("/session/my");

export const joinSession = (id) =>
  API.get(`/session/${id}/join`);

export const completeSession = (id) =>
  API.patch(`/session/${id}/complete`);

// SEND MESSAGE
export const sendMessage = (data) =>
  API.post("/chat/send", data);


// GET MESSAGES
export const getMessages = (user1, user2) =>
  API.get(`/chat/${user1}/${user2}`);

// ================= EXPORT =================
export default API;

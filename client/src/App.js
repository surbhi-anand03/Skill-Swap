import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import CompleteProfile from "./pages/CompleteProfile";

import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Home />
              </>
            </PrivateRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </PrivateRoute>
          }
        />

        {/* DISCOVER */}
        <Route
          path="/discover"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Discover />
              </>
            </PrivateRoute>
          }
        />

        {/* MATCHES */}
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Matches />
              </>
            </PrivateRoute>
          }
        />

        {/* REQUESTS */}
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Requests />
              </>
            </PrivateRoute>
          }
        />

        {/* SESSIONS */}
        <Route
          path="/sessions"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Sessions />
              </>
            </PrivateRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Chat />
              </>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
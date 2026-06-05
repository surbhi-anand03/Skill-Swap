import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import CompleteProfile from "./pages/CompleteProfile";

import PrivateRoute from "./components/PrivateRoute";
// import Navbar from "./components/Navbar";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";
import Chat from "./pages/Chat";
import VideoRoom from "./pages/VideoRoom";

import Main from "./main/main";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* HOME */}
        {/* <Route
          path="/home"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Home />
              </>
            </PrivateRoute>
          }
        /> */}

        <Route
        path="/home"
        element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Layout>
                  <Profile />
                </Layout>
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
                <Layout>
                  <Discover />
                </Layout>
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
                <Layout>
                  <Matches />
                </Layout>
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
                <Layout>
                  <Requests />
                </Layout>
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
                <Layout>
                  <Sessions />
                </Layout>
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
                <Layout>
                  <Chat />
                </Layout>
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/video/:id"
          element={
            <PrivateRoute>
              <>
                <Layout>
                  <VideoRoom />
                </Layout>
              </>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
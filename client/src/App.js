import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import CompleteProfile from "./pages/CompleteProfile";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC ROUTES (NO NAVBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* 🔒 PROTECTED ROUTES (WITH NAVBAR) */}
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
         
        



      </Routes>
    </BrowserRouter>
  );
}

export default App;
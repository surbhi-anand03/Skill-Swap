import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const email =
    location.state?.email ||
    localStorage.getItem("email");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser({
        email,
        ...form,
      });

      alert("Welcome to SkillSwap 🎉");

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center mb-6">
          <CheckCircle
            size={42}
            className="text-violet-600"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Complete Profile
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Just one last step before you
          start your SkillSwap journey.
        </p>

        {/* Email */}
        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-500">
            Verified Email
          </p>

          <p className="font-medium text-violet-700">
            {email}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* Name */}
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">

            <User
              size={18}
              className="text-violet-600"
            />

            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="ml-3 w-full outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">

            <Lock
              size={18}
              className="text-violet-600"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create Password"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="ml-3 w-full outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Password Hint */}
          <p className="text-xs text-gray-500">
            Use at least 8 characters for
            better security.
          </p>

          {/* Finish Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-violet-500
              to-purple-700
              text-white
              py-3.5
              rounded-xl
              font-semibold
              hover:shadow-lg
              transition
            "
          >
            {loading
              ? "Creating Account..."
              : "Finish Signup 🚀"}
          </button>

        </form>

      </div>
    </div>
  );
}
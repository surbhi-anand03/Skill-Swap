import { useState } from "react";
import {
  forgotPasswordOtp,
  verifyOtp,
  resetPassword,
} from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPasswordOtp({ email });

      alert("OTP sent 📩");

      setStep(2);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error sending OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await verifyOtp({
        email,
        otp: otp.trim(),
      });

      alert("OTP verified ✅");

      setStep(3);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPassword({
        email,
        otp: otp.trim(),
        newPassword: password,
      });

      alert(
        "Password reset successful 🎉"
      );

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= item
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {item}
            </div>
          ))}

        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail
                size={30}
                className="text-violet-600"
              />
            </div>

            <h2 className="text-3xl font-bold text-center">
              Forgot Password
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-6">
              Enter your email to receive
              an OTP.
            </p>

            <form
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:border-violet-500">

                <Mail
                  size={18}
                  className="text-violet-600"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  className="ml-3 w-full outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading
                  ? "Sending..."
                  : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck
                size={30}
                className="text-violet-600"
              />
            </div>

            <h2 className="text-3xl font-bold text-center">
              Verify OTP
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-6">
              OTP sent to
            </p>

            <p className="text-center text-violet-600 font-medium mb-6">
              {email}
            </p>

            <form
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <input
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  border
                  rounded-xl
                  py-4
                  text-center
                  text-xl
                  tracking-[8px]
                  outline-none
                  focus:border-violet-500
                "
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock
                size={30}
                className="text-violet-600"
              />
            </div>

            <h2 className="text-3xl font-bold text-center">
              New Password
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-6">
              Create a strong password.
            </p>

            <form
              onSubmit={
                handleResetPassword
              }
              className="space-y-4"
            >
              <div className="flex items-center border rounded-xl px-4 py-3 focus-within:border-violet-500">

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
                  placeholder="New Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading
                  ? "Updating..."
                  : "Reset Password"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
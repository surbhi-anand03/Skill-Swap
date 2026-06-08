import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestOtp, verifyOtp } from "../api/api";
import {
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Signup() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await requestOtp({ email });

      localStorage.setItem(
        "email",
        email
      );

      setStep(2);

      alert("OTP Sent 📩");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error"
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
        otp,
      });

      alert("OTP Verified ✅");

      navigate(
        "/complete-profile",
        {
          state: { email },
        }
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">

      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 text-white p-10">

          <h1 className="text-4xl font-bold mb-4">
            Join SkillSwap
          </h1>

          <p className="text-violet-100 text-lg">
            Learn, teach and grow together
            through skill exchange.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt=""
            className="w-60 mx-auto mt-8"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 flex items-center justify-center">

          <div className="w-full max-w-sm">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="text-3xl font-bold text-center">
                  Create Account
                </h2>

                <p className="text-center text-gray-500 mt-2 mb-6">
                  Enter your email to receive
                  OTP
                </p>

                <form
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <div className="flex items-center border rounded-xl px-4 py-3">

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

                  <p className="text-center text-gray-600 text-sm pt-1">
                    Already have an account?{" "}
                    <Link
                      to="/"
                      className="text-violet-600 font-semibold hover:text-violet-700"
                    >
                      Log In
                    </Link>
                  </p>
                </form>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck
                    size={32}
                    className="text-violet-600"
                  />
                </div>

                <h2 className="text-3xl font-bold text-center">
                  Verify OTP
                </h2>

                <p className="text-center text-gray-500 mt-2 mb-6">
                  Code sent to
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
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                      )
                    }
                    placeholder="Enter OTP"
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
                    className="
                      w-full
                      bg-gradient-to-r
                      from-violet-500
                      to-purple-700
                      text-white
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStep(1)
                    }
                    className="
                      w-full
                      text-violet-600
                      font-medium
                    "
                  >
                    Change Email
                  </button>
                </form>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
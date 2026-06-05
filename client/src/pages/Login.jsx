// import { useState } from "react";
// import { loginUser } from "../api/api";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Users,
//   BookOpen,
//   Rocket,
// } from "lucide-react";

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const res = await loginUser(form);

//       localStorage.setItem(
//         "token",
//         res.data.token
//       );

//       localStorage.setItem(
//         "userId",
//         res.data.user._id
//       );

//       navigate("/home");
//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//           "Login Failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">

//       {/* Background Blobs */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-30 -translate-x-20 -translate-y-20" />
//       <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30 translate-x-20 translate-y-20" />

//       <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl grid lg:grid-cols-2">

//         {/* LEFT PANEL */}
//         <div className="bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 p-10 text-white flex flex-col justify-between">

//           <div>
//             {/* Logo */}
//             <div className="flex items-center gap-3 mb-12">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                 <Users size={24} />
//               </div>

//               <h1 className="text-4xl font-bold">
//                 SkillSwap
//               </h1>
//             </div>

//             <h2 className="text-5xl font-bold leading-tight mb-6">
//               Share Skills.
//               <br />
//               <span className="text-violet-200">
//                 Grow Together.
//               </span>
//             </h2>

//             <p className="text-violet-100 text-lg max-w-md">
//               Join a community where people teach,
//               learn, and grow together through the
//               power of skills.
//             </p>
//           </div>

//           {/* Illustration */}
//           <div className="my-10 flex justify-center">
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
//               alt="SkillSwap"
//               className="w-72"
//             />
//           </div>

//           {/* Features */}
//           <div className="grid grid-cols-3 gap-6 text-center">

//             <div>
//               <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
//                 <Users size={24} />
//               </div>

//               <p className="font-semibold">
//                 Connect
//               </p>

//               <p className="text-sm text-violet-200">
//                 with experts
//               </p>
//             </div>

//             <div>
//               <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
//                 <BookOpen size={24} />
//               </div>

//               <p className="font-semibold">
//                 Learn
//               </p>

//               <p className="text-sm text-violet-200">
//                 new skills
//               </p>
//             </div>

//             <div>
//               <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
//                 <Rocket size={24} />
//               </div>

//               <p className="font-semibold">
//                 Grow
//               </p>

//               <p className="text-sm text-violet-200">
//                 your future
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="p-10 lg:p-14 flex flex-col justify-center">

//           <div className="max-w-md mx-auto w-full">

//             <h2 className="text-4xl font-bold text-gray-900 text-center">
//               Welcome Back!
//             </h2>

//             <p className="text-gray-500 text-center mt-3 mb-10">
//               Login to continue your journey
//             </p>

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-6"
//             >

//               {/* Email */}
//               <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-4 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                 <Mail
//                   className="text-violet-600"
//                   size={20}
//                 />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   onChange={handleChange}
//                   required
//                   className="ml-4 w-full outline-none"
//                 />
//               </div>

//               {/* Password */}
//               <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-4 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                 <Lock
//                   className="text-violet-600"
//                   size={20}
//                 />

//                 <input
//                   type={
//                     showPassword
//                       ? "text"
//                       : "password"
//                   }
//                   name="password"
//                   placeholder="Password"
//                   onChange={handleChange}
//                   required
//                   className="ml-4 w-full outline-none"
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowPassword(
//                       !showPassword
//                     )
//                   }
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} />
//                   ) : (
//                     <Eye size={20} />
//                   )}
//                 </button>
//               </div>

//               {/* Forgot Password */}
//               <div className="text-right">
//                 <Link
//                   to="/forgot-password"
//                   className="text-violet-600 font-medium hover:text-violet-700"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300"
//               >
//                 {loading
//                   ? "Signing In..."
//                   : "Login"}

//                 {!loading && (
//                   <ArrowRight size={20} />
//                 )}
//               </button>

//               {/* Divider */}
//               {/* <div className="flex items-center gap-4 py-2">
//                 <div className="flex-1 h-px bg-gray-200" />
//                 <span className="text-gray-400">
//                   or
//                 </span>
//                 <div className="flex-1 h-px bg-gray-200" />
//               </div> */}

//               {/* Signup */}
//               <p className="text-center text-gray-600 pt-4">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/signup"
//                   className="text-violet-600 font-semibold"
//                 >
//                   Sign Up
//                 </Link>
//               </p>

//             </form>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  Rocket,
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "userId",
        res.data.user._id
      );

      navigate("/home");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 py-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-violet-200 rounded-full blur-3xl opacity-20 -translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 translate-x-20 translate-y-20" />

      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-xl grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 p-8 text-white">

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users size={20} />
              </div>

              <h1 className="text-3xl font-bold">
                SkillSwap
              </h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4 text-black">
              Share Skills.
              <br />
              <span className="text-violet-200">
                Grow Together.
              </span>
            </h2>

            <p className="text-violet-100">
              Join a community where people teach,
              learn and grow together through
              skill exchange.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center my-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="SkillSwap"
              className="w-56"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center">

            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Users size={18} />
              </div>

              <p className="font-medium">
                Connect
              </p>

              <p className="text-xs text-violet-200">
                experts
              </p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                <BookOpen size={18} />
              </div>

              <p className="font-medium">
                Learn
              </p>

              <p className="text-xs text-violet-200">
                skills
              </p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Rocket size={18} />
              </div>

              <p className="font-medium">
                Grow
              </p>

              <p className="text-xs text-violet-200">
                future
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8">

          <div className="w-full max-w-sm">

            <h2 className="text-3xl font-bold text-center text-gray-900">
              Welcome Back!
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-6">
              Login to continue your journey
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Email */}
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Mail
                  size={18}
                  className="text-violet-600"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  required
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
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
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

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {loading
                  ? "Signing In..."
                  : "Login"}
              </button>

              {/* Signup */}
              <p className="text-center text-gray-600 text-sm pt-1">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-violet-600 font-semibold hover:text-violet-700"
                >
                  Sign Up
                </Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
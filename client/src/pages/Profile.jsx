import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/api";
import API from "../api/api";
import { FaArrowLeft, FaEdit, FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.data;

        setForm({
          name: user.name || "",
          skillsOffered: user.skillsOffered?.join(", ") || "",
          skillsWanted: user.skillsWanted?.join(", ") || "",
          bio: user.bio || "",
        });
      } catch (err) {
        if (err.response?.status === 401) navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/user/profile", {
        ...form,
        skillsOffered: form.skillsOffered.split(",").map(s => s.trim()),
        skillsWanted: form.skillsWanted.split(",").map(s => s.trim()),
      });

      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔙 Top Bar */}
      <div className="flex items-center gap-2 px-6 py-4">
      </div>

      {/* 📦 Profile Card */}
      <div className="flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl w-[420px] p-6">

          {/* 👤 Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {form.name ? (
                <span className="text-3xl font-bold text-indigo-600">
                  {form.name[0].toUpperCase()}
                </span>
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl" />
              )}
            </div>

            <h2 className="text-xl font-bold mt-3">
              {form.name || "Anonymous"}
            </h2>
          </div>

          {/* 👀 VIEW MODE */}
          {!editMode ? (
            <div className="mt-6 space-y-4">

              {/* Skills Offered */}
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Skills Offered
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.skillsOffered.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Skills Wanted
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.skillsWanted.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-sm font-semibold text-gray-600">Bio</p>
                <p className="text-gray-700 text-sm mt-1">
                  {form.bio || "No bio available"}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>
          ) : (
            // ✏️ EDIT MODE
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded-lg"
              />

              <input
                name="skillsOffered"
                value={form.skillsOffered}
                onChange={handleChange}
                placeholder="Skills Offered"
                className="w-full p-2 border rounded-lg"
              />

              <input
                name="skillsWanted"
                value={form.skillsWanted}
                onChange={handleChange}
                placeholder="Skills Wanted"
                className="w-full p-2 border rounded-lg"
              />

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full p-2 border rounded-lg"
              />

              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                Save
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="w-full bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
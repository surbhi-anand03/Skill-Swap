import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/api";
import API from "../api/api";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: "",
    bio: "",
  });

  // ✅ FETCH PROFILE (CLEAN)
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
        console.log("PROFILE ERROR:", err);

        // optional: redirect if unauthorized
        if (err.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/user/profile", {
        ...form,
        skillsOffered: form.skillsOffered.split(",").map(s => s.trim()),
        skillsWanted: form.skillsWanted.split(",").map(s => s.trim()),
      });

      alert("Updated ✅");
      setEditMode(false);
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      alert("Update failed ❌");
    }
  };

  return (
    <div>

      {/* 🔙 BACK BUTTON */}
      <div className="profile-topbar">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* PROFILE */}
      <div className="profile-container">
        <div className="profile-card">

          {/* AVATAR */}
          <div className="avatar">
            {form.name ? form.name[0].toUpperCase() : "U"}
          </div>

          {/* VIEW MODE */}
          {!editMode ? (
            <>
              <h2>{form.name}</h2>

              <p><b>Skills Offered:</b> {form.skillsOffered}</p>
              <p><b>Skills Wanted:</b> {form.skillsWanted}</p>
              <p><b>Bio:</b> {form.bio}</p>

              <button onClick={() => setEditMode(true)}>
                Edit Profile ✏️
              </button>
            </>
          ) : (
            // ✏️ EDIT MODE
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />

              <input
                name="skillsOffered"
                value={form.skillsOffered}
                onChange={handleChange}
                placeholder="Skills Offered (comma separated)"
              />

              <input
                name="skillsWanted"
                value={form.skillsWanted}
                onChange={handleChange}
                placeholder="Skills Wanted (comma separated)"
              />

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Bio"
              />

              <button type="submit">Save</button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const token = localStorage.getItem("token");

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: token },
        }
      );

      const user = res.data;

      setForm({
        name: user.name || "",
        skillsOffered: user.skillsOffered?.join(",") || "",
        skillsWanted: user.skillsWanted?.join(",") || "",
        bio: user.bio || "",
      });
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        ...form,
        skillsOffered: form.skillsOffered.split(","),
        skillsWanted: form.skillsWanted.split(","),
      },
      {
        headers: { Authorization: token },
      }
    );

    alert("Updated ✅");
    setEditMode(false); // go back to view mode
  };
return (
  <div>

    {/* ✅ BACK BUTTON BELOW NAVBAR */}
    <div className="profile-topbar">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>

    {/* PROFILE CONTENT */}
    <div className="profile-container">
      <div className="profile-card">

        <div className="avatar">
          {form.name ? form.name[0].toUpperCase() : "U"}
        </div>

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
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="skillsOffered" value={form.skillsOffered} onChange={handleChange} />
            <input name="skillsWanted" value={form.skillsWanted} onChange={handleChange} />
            <textarea name="bio" value={form.bio} onChange={handleChange} />

            <button type="submit">Save</button>

            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        )}

      </div>
    </div>
  </div>
);
}
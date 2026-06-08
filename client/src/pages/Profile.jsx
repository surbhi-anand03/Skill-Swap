import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/api";
import API from "../api/api";
import {
  FaCamera,
  FaUserCircle,
  FaSave,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Profile() {
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: "",
    bio: "",
    profileImage: "",
  });

  const [editMode, setEditMode] =
    useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        const user = res.data;

        setForm({
          name: user.name || "",
          skillsOffered:
            user.skillsOffered?.join(", ") ||
            "",
          skillsWanted:
            user.skillsWanted?.join(", ") ||
            "",
          bio: user.bio || "",
          profileImage:
            user.profileImage || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageUpload = async (
  e
) => {
  const file =
    e.target.files[0];

  if (!file) return;

  try {
    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    const res =
      await API.put(
        "/user/upload-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    setForm((prev) => ({
      ...prev,
      profileImage:
        res.data.image,
    }));

    alert(
      "Profile image uploaded ✅"
    );
  } catch (err) {
    console.log(err);
    alert(
      "Image upload failed"
    );
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/user/profile", {
        ...form,
        skillsOffered:
          form.skillsOffered
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),

        skillsWanted:
          form.skillsWanted
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      });

      setEditMode(false);
      alert("Profile updated ✅");
    } catch (err) {
      console.log(err);
    }
  };

  const offeredSkills =
    form.skillsOffered
      .split(",")
      .filter(Boolean);

  const wantedSkills =
    form.skillsWanted
      .split(",")
      .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto">

        {/* Main Card */}
        {/* <div className="bg-white rounded-3xl shadow-xl overflow-hidden"> */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            border
            border-gray-100
            overflow-hidden
          "
        >

          {/* Header */}
          {/* <div className="h-40 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700" /> */}

          {/* Profile Section */}
          <div className="px-8 pt-8 pb-8">

            <div className="flex flex-col md:flex-row md:items-center gap-6">

              <div className="relative">
                <div
                  className="
                    w-32 h-32 rounded-full
                    overflow-hidden
                    bg-gradient-to-br
                    from-violet-100
                    to-purple-100
                    shadow-[0_10px_30px_rgba(124,58,237,0.2)]
                    flex items-center justify-center
                  "
                >
                  {form.profileImage ? (
                    <img
                      src={
                        form.profileImage
                      }
                      alt="profile"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : form.name ? (
                    <span className="text-5xl font-bold text-violet-700">
                      {form.name[0].toUpperCase()}
                    </span>
                  ) : (
                    <FaUserCircle className="text-7xl text-violet-400" />
                  )}
                </div>

                {editMode && (
                  <label
                    className="
                      absolute
                      bottom-1
                      right-1
                      w-10
                      h-10
                      rounded-full
                      bg-violet-100
                      shadow-md
                      flex
                      items-center
                      justify-center
                      cursor-pointer
                      hover:bg-violet-200
                      transition
                    "
                  >
                    <FaCamera className="text-violet-600" />

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={
                        handleImageUpload
                      }
                    />
                  </label>
                )}

             

              </div>

              <div className="flex-1">

                <h1 className="text-3xl font-bold text-gray-900">
                  {form.name ||
                    "SkillSwap User"}
                </h1>

                <p className="text-gray-500 mt-1">
                  Share skills. Grow together.
                </p>

              </div>

              {!editMode && (
                <button
                  onClick={() =>
                    setEditMode(true)
                  }
                  className="
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-medium
                  "
                >
                  Edit Profile
                </button>
              )}

            </div>

            {/* Form Card */}
              <div
                className="
                  mt-8
                  bg-gradient-to-br
                  from-white
                  to-gray-50
                  rounded-[28px]
                  border
                  border-gray-100
                  shadow-sm
                  p-8
                "
              >
              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">

                  <HiOutlineSparkles className="text-violet-600 text-xl" />

                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Profile Information
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Tell the community about
                    yourself
                  </p>
                </div>

              </div>

              {editMode ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <div>
                    <label className="block font-medium mb-2">
                      Full Name
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      className="
                        w-full
                        border
                        rounded-2xl
                        px-4
                        py-4
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Skills Offered
                    </label>

                    <input
                      name="skillsOffered"
                      value={
                        form.skillsOffered
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="React, Node, Python"
                      className="
                        w-full
                        border
                        rounded-2xl
                        px-4
                        py-4
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Skills Wanted
                    </label>

                    <input
                      name="skillsWanted"
                      value={
                        form.skillsWanted
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="AWS, UI/UX"
                      className="
                        w-full
                        border
                        rounded-2xl
                        px-4
                        py-4
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Bio
                    </label>

                    <textarea
                      rows="5"
                      maxLength="200"
                      name="bio"
                      value={form.bio}
                      onChange={
                        handleChange
                      }
                      className="
                        w-full
                        border
                        rounded-2xl
                        px-4
                        py-4
                        outline-none
                        resize-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />

                    <div className="text-right text-gray-400 text-sm mt-2">
                      {form.bio.length}/200
                    </div>
                  </div>

                  <div className="flex gap-4">

                    <button
                      type="submit"
                      className="
                        flex-1
                        bg-violet-600
                        hover:bg-violet-700
                        text-white
                        py-3
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <FaSave />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditMode(false)
                      }
                      className="
                        flex-1
                        bg-gray-100
                        hover:bg-gray-200
                        py-3
                        rounded-xl
                      "
                    >
                      Cancel
                    </button>

                  </div>

                </form>
              ) : (
                <div className="space-y-8">

                  <div>
                    <h3 className="font-medium mb-3 text-green-800">
                      Skills Offered
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {offeredSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={index}
                            className="
                              px-4 py-2 rounded-full
                            bg-green-200
                            border border-green-400
                            text-green-900
                            font-medium
                            text-sm
                            shadow-sm
                            hover:shadow-md
                            transition
                            "
                          >
                            {skill.trim()}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-blue-700">
                      Skills Wanted
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {wantedSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={index}
                            className="
                                px-4 py-2 rounded-full
                            bg-blue-200
                            border border-blue-400
                            text-blue-900
                            font-medium
                            text-sm
                            shadow-sm
                            hover:shadow-md
                            transition"
                          >
                            {skill.trim()}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-violet-800">
                      Bio
                    </h3>

                    {/* <div className="bg-gray-50 border rounded-2xl p-5"> */}
                      <div
                        className="
                          bg-white
                          border
                          border-gray-200
                          rounded-3xl
                          p-6
                          shadow-sm
                        "
                      >
                      <p className="text-gray-700">
                        {form.bio ||
                          "No bio added yet."}
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
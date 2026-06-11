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
    const fetchProfile =
      async () => {
        try {
          const res =
            await getProfile();

          const user =
            res.data;

          setForm({
            name:
              user.name || "",
            skillsOffered:
              user.skillsOffered?.join(
                ", "
              ) || "",
            skillsWanted:
              user.skillsWanted?.join(
                ", "
              ) || "",
            bio:
              user.bio || "",
            profileImage:
              user.profileImage ||
              "",
          });
        } catch (err) {
          if (
            err.response
              ?.status === 401
          ) {
            navigate("/");
          }
        }
      };

    fetchProfile();
  }, [navigate]);

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageUpload =
    async (e) => {
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

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.put(
          "/user/profile",
          {
            ...form,

            skillsOffered:
              form.skillsOffered
                .split(",")
                .map((s) =>
                  s.trim()
                )
                .filter(
                  Boolean
                ),

            skillsWanted:
              form.skillsWanted
                .split(",")
                .map((s) =>
                  s.trim()
                )
                .filter(
                  Boolean
                ),
          }
        );

        setEditMode(false);

        alert(
          "Profile updated ✅"
        );
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
    <div
      className="
      min-h-screen
      bg-gray-100
      px-3
      sm:px-5
      md:px-6
      lg:px-8
      py-5
      sm:py-6
      overflow-x-hidden
    "
    >
      <div
        className="
        w-full
        max-w-5xl
        mx-auto
      "
      >
        {/* Main Card */}

        <div
          className="
          bg-white
          rounded-[24px]
          sm:rounded-[28px]
          lg:rounded-[32px]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          border
          border-gray-100
          overflow-hidden
        "
        >
          {/* Profile Section */}

          <div
            className="
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            pt-5
            sm:pt-7
            lg:pt-8
            pb-6
            sm:pb-8
          "
          >
            <div
              className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
              lg:gap-6
            "
            >
              {/* LEFT */}

              <div
                className="
                flex
                flex-col
                sm:flex-row
                items-center
                sm:items-center
                gap-5
                w-full
              "
              >
                {/* Avatar */}

                <div className="relative shrink-0">
                  <div
                    className="
                    w-24 h-24
                    sm:w-28 sm:h-28
                    md:w-32 md:h-32
                    rounded-full
                    overflow-hidden
                    bg-gradient-to-br
                    from-violet-100
                    to-purple-100
                    shadow-[0_10px_30px_rgba(124,58,237,0.2)]
                    flex
                    items-center
                    justify-center
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
                      <span
                        className="
                        text-3xl
                        sm:text-4xl
                        md:text-5xl
                        font-bold
                        text-violet-700
                      "
                      >
                        {form.name[0].toUpperCase()}
                      </span>
                    ) : (
                      <FaUserCircle
                        className="
                        text-5xl
                        sm:text-6xl
                        md:text-7xl
                        text-violet-400
                      "
                      />
                    )}
                  </div>

                  {editMode && (
                    <label
                      className="
                      absolute
                      bottom-1
                      right-1
                      w-9 h-9
                      sm:w-10 sm:h-10
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
                      <FaCamera className="text-violet-600 text-sm sm:text-base" />

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

                {/* User Info */}

                <div
                  className="
                  flex-1
                  text-center
                  sm:text-left
                  min-w-0
                "
                >
                  <h1
                    className="
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-bold
                    text-gray-900
                    break-words
                  "
                  >
                    {form.name ||
                      "SkillSwap User"}
                  </h1>

                  <p
                    className="
                    text-gray-500
                    mt-1
                    text-sm
                    sm:text-base
                  "
                  >
                    Share skills.
                    Grow together.
                  </p>
                </div>
              </div>

              {/* Edit Button */}

              {!editMode && (
                <button
                  onClick={() =>
                    setEditMode(
                      true
                    )
                  }
                  className="
                  w-full
                  sm:w-auto
                  shrink-0
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  px-5
                  sm:px-6
                  py-3
                  rounded-xl
                  font-medium
                  transition
                "
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* FORM CARD */}

            <div
              className="
              mt-6
              sm:mt-8
              bg-gradient-to-br
              from-white
              to-gray-50
              rounded-[22px]
              sm:rounded-[28px]
              border
              border-gray-100
              shadow-sm
              p-4
              sm:p-6
              lg:p-8
            "
            >
              <div
                className="
                flex
                items-start
                sm:items-center
                gap-3
                mb-6
                sm:mb-8
              "
              >
                <div
                  className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  bg-violet-100
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                >
                  <HiOutlineSparkles
                    className="
                    text-violet-600
                    text-lg
                    sm:text-xl
                  "
                  />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                    text-lg
                    sm:text-xl
                    font-semibold
                  "
                  >
                    Profile Information
                  </h2>

                  <p
                    className="
                    text-gray-500
                    text-xs
                    sm:text-sm
                  "
                  >
                    Tell the community
                    about yourself
                  </p>
                </div>
              </div>
                            {editMode ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Name */}

                  <div>
                    <label className="block font-medium mb-2 text-sm sm:text-base">
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
                        py-3
                        sm:py-4
                        text-sm
                        sm:text-base
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  {/* Skills Offered */}

                  <div>
                    <label className="block font-medium mb-2 text-sm sm:text-base">
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
                        py-3
                        sm:py-4
                        text-sm
                        sm:text-base
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  {/* Skills Wanted */}

                  <div>
                    <label className="block font-medium mb-2 text-sm sm:text-base">
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
                        py-3
                        sm:py-4
                        text-sm
                        sm:text-base
                        outline-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />
                  </div>

                  {/* Bio */}

                  <div>
                    <label className="block font-medium mb-2 text-sm sm:text-base">
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
                        py-3
                        sm:py-4
                        text-sm
                        sm:text-base
                        outline-none
                        resize-none
                        focus:ring-2
                        focus:ring-violet-500
                      "
                    />

                    <div
                      className="
                      text-right
                      text-gray-400
                      text-xs
                      sm:text-sm
                      mt-2
                    "
                    >
                      {
                        form.bio
                          .length
                      }
                      /200
                    </div>
                  </div>

                  {/* Buttons */}

                  <div
                    className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    sm:gap-4
                  "
                  >
                    <button
                      type="submit"
                      className="
                        w-full
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
                        transition
                      "
                    >
                      <FaSave />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditMode(
                          false
                        )
                      }
                      className="
                        w-full
                        flex-1
                        bg-gray-100
                        hover:bg-gray-200
                        py-3
                        rounded-xl
                        transition
                      "
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-7 sm:space-y-8">

                  {/* Skills Offered */}

                  <div>
                    <h3
                      className="
                      font-medium
                      mb-3
                      text-green-800
                      text-sm
                      sm:text-base
                    "
                    >
                      Skills Offered
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {offeredSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                            className="
                              px-3
                              sm:px-4
                              py-2
                              rounded-full
                              bg-green-200
                              border
                              border-green-400
                              text-green-900
                              font-medium
                              text-xs
                              sm:text-sm
                              shadow-sm
                              hover:shadow-md
                              transition
                              break-words
                            "
                          >
                            {skill.trim()}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Skills Wanted */}

                  <div>
                    <h3
                      className="
                      font-medium
                      mb-3
                      text-blue-700
                      text-sm
                      sm:text-base
                    "
                    >
                      Skills Wanted
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {wantedSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                            className="
                              px-3
                              sm:px-4
                              py-2
                              rounded-full
                              bg-blue-200
                              border
                              border-blue-400
                              text-blue-900
                              font-medium
                              text-xs
                              sm:text-sm
                              shadow-sm
                              hover:shadow-md
                              transition
                              break-words
                            "
                          >
                            {skill.trim()}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Bio */}

                  <div>
                    <h3
                      className="
                      font-medium
                      mb-3
                      text-violet-800
                      text-sm
                      sm:text-base
                    "
                    >
                      Bio
                    </h3>

                    <div
                      className="
                      bg-white
                      border
                      border-gray-200
                      rounded-3xl
                      p-4
                      sm:p-5
                      lg:p-6
                      shadow-sm
                    "
                    >
                      <p
                        className="
                        text-gray-700
                        text-sm
                        sm:text-base
                        break-words
                        leading-7
                      "
                      >
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
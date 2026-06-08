import axios from "axios";

const API = "http://localhost:5000/api";

export const getDiscoverUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API}/user/discover`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
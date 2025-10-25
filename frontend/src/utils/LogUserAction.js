// frontend/src/utils/logUserAction.js
import axios from "axios";

export const logUserAction = async (action, success = true) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.post(
      "http://localhost:5000/api/auth/activity",
      { action, success },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to log user activity:", err);
  }
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        localStorage.clear();
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wide">Welcome, {user?.name}!</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-6 transition-transform hover:scale-105">
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Role:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                user?.role === "admin"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {user?.role?.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resources - Available for all users */}
          <div
            onClick={() => navigate("/resources")}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-xl cursor-pointer hover:scale-105 transform transition"
          >
            <h3 className="text-2xl font-bold mb-2">🖥️ Resources</h3>
            <p className="text-blue-100">Access your resources and tools</p>
          </div>

          {/* Audit Logs - Admin only */}
          {user?.role === "admin" && (
            <div
              onClick={() => navigate("/audit-logs")}
              className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl shadow-xl cursor-pointer hover:scale-105 transform transition"
            >
              <h3 className="text-2xl font-bold mb-2">📋 Audit Logs</h3>
              <p className="text-red-100">View system audit logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
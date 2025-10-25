import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      setSidebarOpen(false);
      navigate("/login");
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 bg-opacity-95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Menu
          </h2>
          {user && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">{user.name}</p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  user.role === "admin" ? "bg-red-600" : "bg-blue-600"
                }`}
              >
                {user.role?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col px-4 py-6 text-white space-y-2">
          <Link
            to="/dashboard"
            className="py-3 px-4 rounded-lg hover:bg-cyan-700 transition-all duration-300 flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span>🛡️</span>
            Dashboard
          </Link>

          <Link
            to="/resources"
            className="py-3 px-4 rounded-lg hover:bg-cyan-700 transition-all duration-300 flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span>🖥️</span>
            Resources
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                to="/audit-logs"
                className="py-3 px-4 rounded-lg hover:bg-cyan-700 transition-all duration-300 flex items-center gap-3"
                onClick={() => setSidebarOpen(false)}
              >
                <span>📋</span>
                Audit Logs
              </Link>
              <Link
                to="/manage-resources"
                className="py-3 px-4 rounded-lg hover:bg-cyan-700 transition-all duration-300 flex items-center gap-3"
                onClick={() => setSidebarOpen(false)}
              >
                <span>🛠️</span>
                Manage Resources
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center gap-3"
          >
            <span>🔐</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
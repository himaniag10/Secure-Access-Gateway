import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 bg-opacity-95 shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mt-16 flex flex-col px-4 text-white space-y-2">
        <Link
          to="/dashboard"
          className="py-2 px-4 rounded hover:bg-cyan-700 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          Dashboard 🛡️
        </Link>
        <Link
          to="/dashboard"
          className="py-2 px-4 rounded hover:bg-cyan-700 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          Audit Logs 📜
        </Link>
        <Link
          to="/dashboard"
          className="py-2 px-4 rounded hover:bg-cyan-700 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          Resources 💻
        </Link>
        <button
          onClick={handleLogout}
          className="mt-6 py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition-colors"
        >
          Logout 🔐
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-900 bg-opacity-95 backdrop-blur-lg text-white p-4 shadow-2xl border-b border-gray-800 sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Side - Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl hover:text-cyan-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Secure Access Gateway
          </h1>
        </div>

        {/* Right Side - User Info & Logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hidden md:block">
            Welcome, <span className="font-semibold text-cyan-400">{userName || "User"}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
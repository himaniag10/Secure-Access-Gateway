import React from "react";
import { Link } from "react-router-dom";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md text-white shadow-md z-50 flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        {/* Hamburger / X Icon */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none relative w-8 h-8"
        >
          <span
            className={`absolute block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
              sidebarOpen ? "rotate-45 top-3" : "top-1"
            }`}
          ></span>
          <span
            className={`absolute block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${
              sidebarOpen ? "opacity-0" : "top-3"
            }`}
          ></span>
          <span
            className={`absolute block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
              sidebarOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          ></span>
        </button>

        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold tracking-widest">
          S<span className="text-cyan-400">A</span>G
        </Link>
      </div>

      <div>
        <Link
          to="/login"
          className="hidden md:inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

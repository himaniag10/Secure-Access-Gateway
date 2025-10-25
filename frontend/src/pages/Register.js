import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminPasskey, setAdminPasskey] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate admin passkey if role is admin
    if (role === "admin" && !adminPasskey) {
      alert("Admin passkey is required to register as admin");
      return;
    }

    try {
      const registerData = {
        name,
        email,
        password,
        role,
      };

      // Only include adminPasskey if role is admin
      if (role === "admin") {
        registerData.adminPasskey = adminPasskey;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        registerData
      );

      // ✅ Store auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userName", res.data.name);

      // ✅ Call the callback to update App state
      if (onRegister) {
        onRegister();
      }

      alert(`Registration successful! Welcome ${res.data.name}`);

      // ✅ Navigate with replace
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-6">
      <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-cyan-600">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">
          Create Account 🚀
        </h2>

        {role === "admin" && (
          <div className="bg-red-900 bg-opacity-50 border border-red-600 p-3 rounded-md mb-4">
            <p className="text-sm text-red-200 text-center">
              ⚠️ Admin Registration - Passkey Required
            </p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Role</label>
            <select
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === "admin" && (
            <div>
              <label className="block mb-1 text-sm text-gray-300">
                Admin Passkey 🔑
              </label>
              <input
                type="password"
                className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-600"
                placeholder="Enter admin passkey"
                value={adminPasskey}
                onChange={(e) => setAdminPasskey(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Contact system administrator for admin passkey
              </p>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-md font-semibold transition shadow-lg ${
              role === "admin"
                ? "bg-red-600 hover:bg-red-700 shadow-red-700/40"
                : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-700/40"
            }`}
          >
            {role === "admin" ? "Register as Admin" : "Register as User"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
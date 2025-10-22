import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create pass 📝");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-10 rounded-lg shadow-lg w-96 flex flex-col"
      >
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          Register 📝
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-6 p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="security_officer">Security Officer</option>
        </select>
        <button className="p-3 rounded bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold transition-colors">
          Get Pass 🛡️
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Register;

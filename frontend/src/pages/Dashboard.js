import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [resources, setResources] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch logged-in user info
        const { data } = await api.get("/auth/me");
        setUser(data);

        // Fetch resources (simulate for now, later can use real API)
        const userResources = [
          { name: "Finance App", access: data.role === "admin" || data.role === "user" },
          { name: "HR Dashboard", access: data.role === "admin" },
          { name: "DevOps Tool", access: data.role === "security_officer" },
        ];
        setResources(userResources);

        // Fetch audit logs (simulate for now, can replace with backend API)
        const auditLogs = [
          { who: "John", when: "2025-10-22 10:00", from: "192.168.1.2", what: "Dashboard" },
          { who: "Alice", when: "2025-10-22 09:30", from: "192.168.1.3", what: "HR" },
        ];
        setLogs(auditLogs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="p-6 md:ml-64">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 drop-shadow-lg">
        Welcome, {user.name || "User"} 🛡️
      </h1>

      <h2 className="text-2xl font-semibold mb-4 text-gray-300">💻 Your Resources</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {resources.map((res, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg shadow-lg transition transform hover:scale-105 ${
              res.access
                ? "bg-cyan-700 hover:bg-cyan-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{res.name}</h3>
            <p className="text-sm">{res.access ? "Access Granted ✅" : "Access Denied ❌"}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-300">📜 Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-left text-gray-400">Who</th>
              <th className="py-2 px-4 text-left text-gray-400">When</th>
              <th className="py-2 px-4 text-left text-gray-400">From</th>
              <th className="py-2 px-4 text-left text-gray-400">What</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="py-2 px-4">{log.who}</td>
                <td className="py-2 px-4">{log.when}</td>
                <td className="py-2 px-4">{log.from}</td>
                <td className="py-2 px-4">{log.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

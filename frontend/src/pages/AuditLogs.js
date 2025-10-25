import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");

        if (!token) {
          navigate("/login");
          return;
        }

        if (userRole !== "admin") {
          navigate("/dashboard");
          return;
        }

        const res = await api.get("/admin/audit-logs");
        setAuditLogs(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        setError(error.response?.data?.message || "Failed to fetch audit logs");
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            Loading audit logs...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-xl p-6">
          <p className="text-red-400 text-xl">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="text-5xl">📋</span>
            Audit Logs
          </h1>
          <p className="text-cyan-100 mt-2">Monitor all system activities and user actions</p>
        </div>

        {Object.keys(auditLogs).length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl text-center border border-gray-700">
            <p className="text-gray-400 text-lg">No audit logs available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(auditLogs).sort().reverse().map((date) => (
              <div
                key={date}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                  <span>📅</span>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <span className="text-sm text-gray-400 ml-2">({auditLogs[date].length} events)</span>
                </h2>
                <div className="space-y-3">
                  {auditLogs[date].map((log, index) => (
                    <div
                      key={log._id}
                      className={`p-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] ${
                        log.success
                          ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                          : "bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700"
                      } border ${log.success ? "border-gray-600" : "border-red-600"}`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        animation: "fadeIn 0.5s ease-in-out forwards",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-bold text-lg text-white">
                              {log.user?.name || "Unknown User"}
                            </span>
                            <span className="text-sm text-gray-300 bg-gray-900 bg-opacity-50 px-2 py-1 rounded">
                              {log.user?.email || "N/A"}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                log.user?.role === "admin"
                                  ? "bg-red-600 text-white"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {log.user?.role?.toUpperCase() || "UNKNOWN"}
                            </span>
                          </div>
                          <p className="text-gray-200 mb-2 text-lg">{log.action}</p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <span>🌐</span>
                              IP: {log.ip || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>🕐</span>
                              {new Date(log.createdAt || log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                            log.success
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {log.success ? "✓ Success" : "✗ Failed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AuditLogs;
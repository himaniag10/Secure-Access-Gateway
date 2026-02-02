import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ManageResources() {
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", description: "", url: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      const resourcesRes = await api.get("/admin/resources");
      const usersRes = await api.get("/admin/users");
      setResources(resourcesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/resources", newResource);
      alert("✅ Resource created successfully!");
      setNewResource({ name: "", description: "", url: "" });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Failed to create resource"));
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this resource?")) {
      try {
        await api.delete(`/admin/resources/${id}`);
        alert("✅ Resource deleted successfully!");
        fetchData();
      } catch (error) {
        alert("❌ " + (error.response?.data?.message || "Failed to delete resource"));
      }
    }
  };

  const handleGrantAccess = async (resourceId, userId) => {
    try {
      await api.post("/admin/grant-access", { resourceId, userId });
      alert("✅ Access granted successfully!");
      fetchData();
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Failed to grant access"));
    }
  };

  const handleRevokeAccess = async (resourceId, userId) => {
    try {
      await api.post("/admin/revoke-access", { resourceId, userId });
      alert("✅ Access revoked successfully!");
      fetchData();
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Failed to revoke access"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-2xl animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <span className="text-5xl">🛠️</span>
              Manage Resources
            </h1>
            <p className="text-purple-100 mt-2">Create and manage system resources and user access</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-xl transition-all duration-300 font-bold shadow-lg transform hover:scale-105 cursor-pointer"
          >
            {showCreateForm ? "✕ Cancel" : "+ Create Resource"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-2xl mb-8 border border-gray-700 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Create New Resource</h2>
            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Resource Name</label>
                <input
                  type="text"
                  placeholder="e.g., Finance Dashboard"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                <textarea
                  placeholder="Describe what this resource provides..."
                  className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all"
                  rows="3"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all duration-300 font-bold shadow-lg transform hover:scale-105 cursor-pointer"
              >
                Create Resource
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {resources.length === 0 ? (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl text-center border border-gray-700">
              <p className="text-gray-400 text-lg">No resources yet. Create one to get started!</p>
            </div>
          ) : (
            resources.map((resource, index) => (
              <div
                key={resource._id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-xl animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2">{resource.name}</h3>
                    <p className="text-gray-300 text-lg mb-2">{resource.description}</p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔗</span>
                        {resource.url}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteResource(resource._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg ml-4 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h4 className="font-bold text-lg mb-3 text-green-400">✓ Users with Access:</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.usersWithAccess && resource.usersWithAccess.length > 0 ? (
                      resource.usersWithAccess.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-900 bg-opacity-50 rounded-full border border-green-600 hover:bg-green-800 transition-all"
                        >
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-xs text-green-300">({user.email})</span>
                          <button
                            onClick={() => handleRevokeAccess(resource._id, user._id)}
                            className="text-red-400 hover:text-red-300 font-bold ml-2 hover:scale-125 transition-transform cursor-pointer"
                            title="Revoke access"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No users have access yet</span>
                    )}
                  </div>

                  <h4 className="font-bold text-lg mb-3 text-blue-400">+ Grant Access to Users:</h4>
                  <div className="flex flex-wrap gap-2">
                    {users
                      .filter(
                        (user) =>
                          !resource.usersWithAccess?.some((u) => u._id === user._id)
                      )
                      .map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleGrantAccess(resource._id, user._id)}
                          className="px-4 py-2 bg-blue-900 bg-opacity-50 hover:bg-blue-800 rounded-full border border-blue-600 transition-all duration-300 hover:scale-105 transform cursor-pointer"
                        >
                          <span className="font-semibold">+ {user.name}</span>
                          <span className="text-xs text-blue-300 ml-1">({user.email})</span>
                        </button>
                      ))}
                    {users.filter(
                      (user) =>
                        !resource.usersWithAccess?.some((u) => u._id === user._id)
                    ).length === 0 && (
                        <span className="text-gray-500 italic">All users have access</span>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Animation styles moved here for CRA/Vite */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
          .animate-slideIn { animation: slideIn 0.5s ease-in-out forwards; }
        `}
      </style>
    </div>
  );
}

export default ManageResources;

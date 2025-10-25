import { useEffect, useState } from "react";
import api from "../api/api";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get("/resources");
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-2xl animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading resources...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="text-5xl">🖥️</span>
            Your Resources
          </h1>
          <p className="text-blue-100 mt-2">Access your authorized system resources</p>
        </div>

        {resources.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl text-center border border-gray-700">
            <p className="text-gray-400 text-lg mb-4">🔒 No resources available</p>
            <p className="text-gray-500">
              Contact your administrator to request access to resources
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div
                key={resource._id}
                className="bg-gradient-to-br from-blue-800 to-purple-900 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 border border-blue-600 hover:border-cyan-400 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h2 className="text-2xl font-bold mb-3 text-white">{resource.name}</h2>
                <p className="text-blue-100 mb-4 min-h-[60px]">{resource.description}</p>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                  >
                    Access Resource →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Resources;

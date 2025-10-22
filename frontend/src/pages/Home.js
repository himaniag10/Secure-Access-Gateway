import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-5xl font-bold mb-10 tracking-wide">
        Secure Access Gateway
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        Choose your access level to enter the system.
      </p>

      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/login", { state: { role: "admin" } })}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold shadow-lg transition duration-300"
        >
          Login as Admin
        </button>

        <button
          onClick={() => navigate("/login", { state: { role: "user" } })}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold shadow-lg transition duration-300"
        >
          Login as User
        </button>
      </div>
    </div>
  );
}

export default Home;

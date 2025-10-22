import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";


function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  // hide navbar and sidebar on login/register pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";

  return (
    <>
      {!hideLayout && (
        <>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </>
      )}
      <div
        className={`transition-all duration-300 ${
          !hideLayout ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Default Route */}
          <Route path="/" element={<Home />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

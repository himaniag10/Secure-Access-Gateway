import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import AuditLogs from "./pages/AuditLogs";
import ManageResources from "./pages/ManageResources";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <>
      {!hideLayout && token && (
        <>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </>
      )}
      <div className={`transition-all duration-300 ${!hideLayout && token ? "ml-0" : ""}`}>
        {children}
      </div>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAuthUpdate = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleAuthUpdate} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register onRegister={handleAuthUpdate} />
              )
            }
          />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/resources"
            element={
              isAuthenticated ? (
                <Resources />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/audit-logs"
            element={
              isAuthenticated ? (
                <AuditLogs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/manage-resources"
            element={
              isAuthenticated ? (
                <ManageResources />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

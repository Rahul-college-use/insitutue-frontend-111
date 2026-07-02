import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Layout Components
import Announcement from './components/Announcement';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Register from './components/user/Register';
import Login from './components/user/Login';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './components/admin/AdminDashboard';

// 1. Student Protected Route Component
function ProtectedRoute({ isAuthenticated, children }) {
  const hasToken = !!localStorage.getItem('token');
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIXED: Prevent Admin from locking himself inside Student Dashboard View layout structure
  if (isAdminUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// 2. Safe Guarded Admin Route Component
function AdminRoute({ isAuthenticated, children }) {
  const hasToken = !!localStorage.getItem('token');
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// 3. Main App Content Manager
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tracking 'token' state dynamically
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  // Cross-Tab/Same-Tab Authentication State Sync
  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', syncAuthState);
    return () => {
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  // ✅ FIXED: Strict path detection rules to split workspace panels perfectly
  const isWorkspaceView = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased flex flex-col">

      {/* Global Headers: Hidden inside active coding/learning environments */}
      {!isWorkspaceView && (
        <div className="w-full z-50 sticky top-0 flex flex-col">
          <Announcement />
          <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </div>
      )}

      {/* Main Viewport Routing Gateway */}
      <main className="relative flex-grow flex flex-col">
        <Routes>
          {/* Public Guest Routes */}
          <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

          {/* Secure Private Student Workspace Hub */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DashboardPage setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            }
          />
          
          {/* Secured Administrative Operations Panel */}
          <Route
            path="/admin/dashboard/*"
            element={
              <AdminRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
              </AdminRoute>
            }
          />

          {/* ✅ SMART REDIRECT GATE: Dynamic router based on true local verification tokens */}
          <Route 
            path="/dashboard-gate" 
            element={
              localStorage.getItem('isAdmin') === 'true' 
                ? <Navigate to="/admin/dashboard" replace /> 
                : <Navigate to="/dashboard" replace />
            } 
          />

          {/* Catch-all Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isWorkspaceView && <Footer />}
    </div>
  );
}

// 4. Global App Entry Shell
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
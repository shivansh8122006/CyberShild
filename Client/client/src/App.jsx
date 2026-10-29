import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Public User Pages
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import SecurityTools from "./pages/SecurityTools";
import Awareness from "./pages/Awareness";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Admin Panel Pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminDashboard from "./admin/Dashboard";
import AdminUsers from "./admin/Users";
import AdminArticles from "./admin/Articles";
import AdminSecurity from "./admin/Security";
import AdminSettings from "./admin/Settings";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* User Navbar only rendered on public client pages */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ================= USER ROUTES (100% Preserved) ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/tools" element={<SecurityTools />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminArticles />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/security"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminSecurity />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* User Footer only rendered on public client pages */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
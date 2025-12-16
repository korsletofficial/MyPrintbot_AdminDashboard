import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAdminAuthStore } from './stores/authStore';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/Dashboard';
import PrintPartners from './pages/PrintPartners';
import Clients from './pages/Clients';
import Templates from './pages/Templates';
import TemplateBuilder from './pages/TemplateBuilder';
import Settings from './pages/Settings';
import FAQs from './pages/FAQs';
import ReferralAnalytics from './pages/ReferralAnalytics';
import SupportQueries from './pages/SupportQueries';
import './index.css';
import './utils/devAuth'; // Import dev auth helper (makes window.devAuth available)

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/print-partners" element={
          <ProtectedRoute>
            <PrintPartners />
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        } />
        <Route path="/templates/create" element={
          <ProtectedRoute>
            <TemplateBuilder />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/faqs" element={
          <ProtectedRoute>
            <FAQs />
          </ProtectedRoute>
        } />
        <Route path="/referrals" element={
          <ProtectedRoute>
            <ReferralAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/support-queries" element={
          <ProtectedRoute>
            <SupportQueries />
          </ProtectedRoute>
        } />

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 - Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

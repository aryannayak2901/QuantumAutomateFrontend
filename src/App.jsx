import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, TestApi, UserDashboard } from './pages';
import AboutPage from './pages/AboutPage/AboutPage';
import PricingPage from './pages/PricingPage/PricingPage';
import ContactPage from './pages/ContactPage/ContactPage';
// import { RequireAuth } from '../components/Auth';
import './styles/global.css';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import { ForgotPassword, OTPVerification, Register, ResetPassword, SignIn } from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible to all */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Guest Routes - Only for non-authenticated users */}
        <Route
          path="/signin"
          element={
            <GuestRoute>
              <SignIn />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <GuestRoute>
              <OTPVerification />
            </GuestRoute>
          }
        />

        {/* Protected Routes - Only for authenticated users */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route - 404 and redirects */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

// 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-400 mb-4">404</h1>
        <p className="text-xl text-white mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;

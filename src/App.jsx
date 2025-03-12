import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/home/Homepage';
import UserDashboard from './components/dashboard/UserDashboard';
import InstagramDashboard from './components/instagram/InstagramDashboard';
import DMAutomation from './components/instagram/DMAutomation';
import CallAgent from './components/calling/CallAgent';
import AICallingDashboard from './components/UserDashboardComponents/AICallingDashboard';
import { CallScripts } from './components/calling';
import Settings from './components/settings/Settings';
import LeadDetailPage from './pages/UserDashboard/LeadsManagement/LeadDetailPage';
import LeadListPage from './pages/UserDashboard/LeadsManagement/LeadListPage';
import LeadPipeline from './pages/UserDashboard/LeadsManagement/LeadPipeline';

// Import auth components from pages/Auth only
import { SignIn, Register, OTPVerification, ForgotPassword, ResetPassword } from './pages/Auth';

// Import route guards
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

// About and Pricing page components
const AboutPage = () => (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">About QuantumAI</h1>
            <p className="text-lg text-gray-600 mb-4">
                QuantumAI is a cutting-edge AI automation platform designed to help businesses 
                streamline their operations, from lead generation to customer engagement.
            </p>
            <p className="text-lg text-gray-600 mb-4">
                Our mission is to empower businesses with intelligent automation tools that save 
                time, reduce costs, and drive growth.
            </p>
            <p className="text-lg text-gray-600 mb-4">
                Founded in 2023, QuantumAI has quickly become a trusted partner for businesses 
                looking to leverage the power of AI in their operations.
            </p>
        </div>
    </div>
);

const PricingPage = () => {
    // Import and use the Link component instead of useNavigate
    const registerUrl = "/register";
    
    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <div className="max-w-5xl mx-auto py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pricing Plans</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Choose the plan that fits your business needs
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Basic</h2>
                        <p className="text-3xl font-bold mb-4">$49<span className="text-sm text-gray-500">/month</span></p>
                        <ul className="mb-6 space-y-2">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Instagram Lead Generation
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Basic Analytics
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Email Support
                            </li>
                        </ul>
                        <a 
                            href={registerUrl}
                            className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                        >
                            Get Started
                        </a>
                    </div>
                    
                    {/* Pro Plan */}
                    <div className="bg-blue-600 p-8 rounded-lg shadow-md border border-blue-500 transform scale-105">
                        <h2 className="text-xl font-bold text-white mb-4">Pro</h2>
                        <p className="text-3xl font-bold text-white mb-4">$99<span className="text-sm text-blue-200">/month</span></p>
                        <ul className="mb-6 space-y-2 text-white">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Everything in Basic
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                AI-Powered Calling
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Advanced Analytics
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Priority Support
                            </li>
                        </ul>
                        <a 
                            href={registerUrl}
                            className="block w-full bg-white text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors font-semibold text-center"
                        >
                            Get Started
                        </a>
                    </div>
                    
                    {/* Enterprise Plan */}
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Enterprise</h2>
                        <p className="text-3xl font-bold mb-4">$199<span className="text-sm text-gray-500">/month</span></p>
                        <ul className="mb-6 space-y-2">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Everything in Pro
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Custom Integrations
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Dedicated Account Manager
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                24/7 Phone Support
                            </li>
                        </ul>
                        <a 
                            href={registerUrl}
                            className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
  return (
    <Router>
      <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
                
                {/* Guest-only Routes (redirect to dashboard if authenticated) */}
                <Route path="/signin" element={
            <GuestRoute>
              <SignIn />
            </GuestRoute>
                } />
                
                <Route path="/register" element={
            <GuestRoute>
              <Register />
            </GuestRoute>
                } />
                
                <Route path="/verify-otp" element={
                    <GuestRoute>
                        <OTPVerification />
                    </GuestRoute>
                } />
                
                <Route path="/forgot-password" element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
                } />
                
                <Route path="/reset-password" element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
                } />

                {/* Protected Routes (require authentication) */}
                <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
                } />
                
                <Route path="/dashboard/leads" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <LeadListPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/dashboard/leads/pipeline" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <LeadPipeline />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/instagram/overview" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <InstagramDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/instagram/dm-automation" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <DMAutomation />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/leads" element={
                    <Navigate to="/dashboard/leads" replace />
                } />
                
                <Route path="/leads/:id" element={
                    <ProtectedRoute>
                        <Navigate to={location => `/dashboard/leads/detail/${location.pathname.split('/')[2]}`} replace />
                    </ProtectedRoute>
                } />
                
                <Route path="/dashboard/leads/detail/:id" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <LeadDetailPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/calling/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <AICallingDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/calling/agent" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <CallAgent />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/calling/scripts" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <CallScripts />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                
                <Route path="/calling" element={
                    <Navigate to="/calling/dashboard" replace />
                } />
                
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Settings />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

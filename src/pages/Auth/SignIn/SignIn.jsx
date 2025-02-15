import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import AuthLayout from '../AuthLayout/AuthLayout';
import API from '../../../api';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Redirect user to dashboard if already logged in
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            console.log("Form Data Sent:", formData);  // Log form data for debugging
    
            const response = await API.post('users/login/', formData);
            
            // Store tokens in localStorage
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
    
            alert(response.data.message || 'Sign-in successful!');
            navigate('/dashboard'); // Redirect after successful sign-in
        } catch (error) {
            console.error("Sign-in Error:", error.response?.data || error.message);
            alert(error.response?.data?.error || 'Sign-in failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleFacebookLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook/`;
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-secondary-800 text-gray-400">Or continue with</span>
                    </div>
                </div>

                {/* Facebook OAuth Button */}
                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="w-full bg-[#1877F2] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1864D6] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <Facebook className="w-5 h-5" />
                    Sign in with Facebook
                </button>

                {/* Register Link */}
                <p className="text-center text-gray-400 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 hover:text-primary-300">
                        Create one
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignIn;

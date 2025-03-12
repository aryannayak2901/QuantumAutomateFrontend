import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import AuthLayout from '../AuthLayout/AuthLayout';
import { login } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateUser, authenticated } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log('Login attempt with:', { email: formData.email });
            const response = await login({ email: formData.email, password: formData.password });
            console.log('Login response:', response);
            
            // If we get here, login was successful
            if (response.user) {
                updateUser(response.user);
            }
            
            // Redirect to dashboard or intended location
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || err.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleFacebookLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook/`;
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your account"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full rounded-lg bg-secondary-700 border-transparent focus:border-primary-500 focus:bg-secondary-600 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="block w-full rounded-lg bg-secondary-700 border-transparent focus:border-primary-500 focus:bg-secondary-600 text-white pr-10"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="rounded bg-secondary-700 border-transparent focus:ring-primary-500 text-primary-600"
                        />
                        <label className="ml-2 block text-sm text-gray-300">
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
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

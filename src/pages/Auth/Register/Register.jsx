import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import AuthLayout from '../AuthLayout/AuthLayout';
import { signup } from '../../../services/authService';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        business_type: 'ecommerce',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Submitting registration data:", formData);
            const response = await signup(formData);
            console.log("Registration successful:", response);
            
            // The backend has accepted the registration and sent an OTP
            // Navigate to the OTP verification page - use the correct route
            navigate('/verify-otp', { 
                state: { email: formData.email },
                replace: true // Replace current history entry to prevent back navigation to registration
            });
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.message || err.detail || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // This will get the token from Facebook SDK or similar implementation
            const accessToken = "YOUR_FACEBOOK_ACCESS_TOKEN"; // Use the real token obtained after FB OAuth

            // Import correctly from authService instead of using API
            const response = await import('../../../services/authService')
                .then(module => module.facebookLogin(accessToken));

            // Store the tokens correctly
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refresh);
            localStorage.setItem('user', JSON.stringify(response.user));

            alert("Facebook login successful");
            navigate('/dashboard');
        } catch (error) {
            console.error("Facebook Login Error:", error);
            alert(error.message || "Facebook login failed");
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start your journey with QuantumAI"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                </div>

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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
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

                {/* Confirm Password Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Phone Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                {/* Business Type Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Type
                    </label>
                    <select
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                        value={formData.business_type}
                        onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    >
                        <option value="ecommerce">E-commerce</option>
                        <option value="service">Service Business</option>
                        <option value="retail">Retail</option>
                        <option value="saas">SaaS</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
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
                    Sign up with Facebook
                </button>

                {/* Sign In Link */}
                <p className="text-center text-gray-400 mt-8">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-primary-400 hover:text-primary-300">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
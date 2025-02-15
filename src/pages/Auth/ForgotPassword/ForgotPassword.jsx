import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout/AuthLayout';
import API from '../../../api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await API.post('users/auth/forgot-password/', { email });
            setIsSubmitted(true);
            // Store email in localStorage for the reset password page
            localStorage.setItem('resetPasswordEmail', email);
            setCanResend(false);
            setTimeLeft(60);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        navigate('/reset-password');
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent you an OTP code"
            >
                <div className="text-center">
                    <p className="text-gray-400 mb-8">
                        We've sent an OTP code to <strong className="text-white">{email}</strong>.
                        Please check your email and use the code to reset your password.
                    </p>
                    <div className="text-gray-400 mb-4">
                        Didn't receive the code?
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="text-primary-400 hover:text-primary-300"
                            >
                                Resend Code
                            </button>
                        ) : (
                            <p>Resend code in {timeLeft} seconds</p>
                        )}
                    </div>
                    <button
                        onClick={handleVerifyOTP}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 mb-4"
                    >
                        Continue to Reset Password
                    </button>
                    <Link
                        to="/signin"
                        className="text-primary-400 hover:text-primary-300"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="We'll send you an OTP code"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send OTP Code'}
                </button>

                <p className="text-center text-gray-400 mt-8">
                    Remember your password?{' '}
                    <Link to="/signin" className="text-primary-400 hover:text-primary-300">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
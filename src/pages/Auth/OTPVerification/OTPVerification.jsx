import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout/AuthLayout';
import { verifyEmail, resendVerification } from '../../../services/authService';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            alert("No email information found. Please go back to registration.");
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleChange = (element, index) => {
        if (!/^\d?$/.test(element.value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = element.value;
        setOtp(updatedOtp);

        // Move to next input or previous if backspace is pressed
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        } else if (!element.value && element.previousSibling) {
            element.previousSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join(''); // Join the OTP digits

        try {
            // Use the authService verifyEmail function with correct parameters
            const response = await verifyEmail(email, enteredOtp);
            
            // Store tokens if they are returned
            if (response.tokens) {
                localStorage.setItem('token', response.tokens.access);
                localStorage.setItem('refreshToken', response.tokens.refresh);
            }
            
            alert(response.message || 'Email verified successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Email Verification Error:", error);
            
            let errorMessage = 'Verification failed. Please check your OTP code.';
            if (typeof error === 'object') {
                if (error.error) errorMessage = error.error;
                else if (error.message) errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    };

    const handleResendOTP = async () => {
        setTimeLeft(30);
        setCanResend(false);

        try {
            // Use the authService resendVerification function
            const response = await resendVerification(email);
            alert(response.message || 'Verification code resent successfully');
        } catch (error) {
            console.error("Resend Verification Error:", error);
            
            let errorMessage = 'Failed to resend verification code';
            if (typeof error === 'object') {
                if (error.error) errorMessage = error.error;
                else if (error.message) errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle={`Enter the 6-digit code sent to ${email || 'your email'}`}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP Input Fields */}
                <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-12 h-12 text-center text-xl bg-secondary-700/50 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                        />
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
                >
                    Verify Email
                </button>

                {/* Resend OTP */}
                <div className="text-center text-gray-400">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            className="text-primary-400 hover:text-primary-300"
                        >
                            Resend Code
                        </button>
                    ) : (
                        <p>Resend code in {timeLeft} seconds</p>
                    )}
                </div>

                {/* Back to Sign In */}
                <p className="text-center text-gray-400 mt-8">
                    <Link to="/signin" className="text-primary-400 hover:text-primary-300">
                        Back to Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default OTPVerification;

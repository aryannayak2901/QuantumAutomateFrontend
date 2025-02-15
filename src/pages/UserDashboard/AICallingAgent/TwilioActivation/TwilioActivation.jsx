import React, { useState, useEffect, useCallback } from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CustomAlert = ({ variant = 'default', title, children }) => {
    const variants = {
        destructive: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        default: 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return (
        <div className={`rounded-lg border p-4 mb-4 ${variants[variant]}`}>
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <h3 className="font-medium">{title}</h3>
            </div>
            <div className="mt-2 text-sm">{children}</div>
        </div>
    );
};

const TwilioActivation = () => {
    const [status, setStatus] = useState({
        active: false,
        phoneNumber: null,
        hasCredits: false,
        loading: true,
        error: null
    });

    const [verificationPhone, setVerificationPhone] = useState('');
    const [activating, setActivating] = useState(false);
    const [showPhoneInput, setShowPhoneInput] = useState(false);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        timeout: 30000, // Increased timeout for activation
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const validatePhoneNumber = (phone) => {
        // Basic E.164 format validation
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    };

    const checkTwilioStatus = useCallback(async () => {
        try {
            const response = await axiosInstance.get("users/twilio-status/");
            console.log("Twilio status response:", response.data);

            setStatus({
                active: response.data.active,
                phoneNumber: response.data.twilio_phone_number,
                hasCredits: response.data.has_credits,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Failed to check Twilio status:", error);

            if (error.response?.status === 401) {
                // Redirect to login page if unauthorized
                window.location.href = "/signin";
                return;
            }

            setStatus(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.error || "Failed to check status"
            }));
        }
    }, []);

    const handleActivate = async () => {
        if (!verificationPhone) {
            setShowPhoneInput(true);
            return;
        }

        if (!validatePhoneNumber(verificationPhone)) {
            setStatus(prev => ({
                ...prev,
                error: "Please enter a valid phone number in E.164 format (e.g., +1234567890)"
            }));
            return;
        }

        setActivating(true);
        try {
            const response = await axiosInstance.post("users/create-twilio-subaccount/", {
                verification_phone: verificationPhone
            });

            if (response.data.needs_verification) {
                setStatus(prev => ({
                    ...prev,
                    error: "Please verify your phone number with the code sent."
                }));
                return;
            }

            setStatus({
                active: true,
                phoneNumber: response.data.twilio_phone_number,
                hasCredits: true,
                loading: false,
                error: null
            });
            setShowPhoneInput(false);
        } catch (error) {
            console.error("Failed to activate Twilio:", error);

            const errorMessage = error.response?.data?.error ||
                error.response?.data?.details ||
                "Failed to activate Twilio service";

            setStatus(prev => ({
                ...prev,
                error: errorMessage
            }));
        } finally {
            setActivating(false);
        }
    };

    useEffect(() => {
        checkTwilioStatus();
    }, [checkTwilioStatus]);

    if (status.loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    if (status.error) {
        return (
            <div className="space-y-4">
                <CustomAlert variant="destructive" title="Error">
                    {status.error}
                </CustomAlert>
                {!status.active && (
                    <button
                        onClick={() => checkTwilioStatus()}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <h2 className="text-lg font-semibold">Twilio Status</h2>
            </div>

            {status.active ? (
                <CustomAlert title="Active">
                    Your Twilio account is active and your phone number is {status.phoneNumber}.
                    {!status.hasCredits && (
                        <div className="mt-2 text-red-600">
                            Warning: You have no credits remaining.
                        </div>
                    )}
                </CustomAlert>
            ) : (
                <div className="space-y-4">
                    <CustomAlert variant="warning" title="Not Active">
                        Your Twilio account is not active. Please activate it to use SMS features.
                    </CustomAlert>

                    {showPhoneInput && (
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Verification Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={verificationPhone}
                                onChange={(e) => setVerificationPhone(e.target.value)}
                                placeholder="+1234567890"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <p className="text-sm text-gray-500">
                                Enter your phone number in E.164 format (e.g., +1234567890)
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleActivate}
                        disabled={activating || (showPhoneInput && !verificationPhone)}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {activating ? (
                            <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Activating...
                            </div>
                        ) : showPhoneInput ? (
                            "Verify Phone Number"
                        ) : (
                            "Activate Twilio"
                        )}
                    </button>
                </div>
            )}

            {status.error && (
                <CustomAlert variant="destructive" title="Error">
                    {status.error}
                </CustomAlert>
            )}
        </div>
    );
};

export default TwilioActivation;
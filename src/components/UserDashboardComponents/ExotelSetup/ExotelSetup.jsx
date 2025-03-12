import React, { useState, useEffect } from 'react';
import { Card, Button, message, Spin } from 'antd';
import { CheckCircle, XCircle, Phone } from 'lucide-react';
import ExotelService from '../../../services/exotelService';

const ExotelSetup = () => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({
        hasExotel: false,
        phoneVerified: false
    });

    useEffect(() => {
        checkExotelStatus();
    }, []);

    const checkExotelStatus = async () => {
        try {
            const response = await ExotelService.getStatus();
            setStatus({
                hasExotel: response.has_exotel,
                phoneVerified: response.phone_verified
            });
        } catch (error) {
            message.error('Failed to check Exotel status');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubaccount = async () => {
        try {
            setLoading(true);
            await ExotelService.createSubaccount();
            message.success('Exotel account created successfully');
            await checkExotelStatus();
        } catch (error) {
            message.error(error.message || 'Failed to create Exotel account');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card title="Calling Integration Setup" className="shadow-md">
            <div className="space-y-6">
                {/* Exotel Account Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Phone className="w-6 h-6 text-primary-600" />
                        <div>
                            <h3 className="font-medium">Exotel Account</h3>
                            <p className="text-sm text-gray-500">
                                {status.hasExotel 
                                    ? 'Your Exotel account is active' 
                                    : 'Setup your Exotel account for calling features'}
                            </p>
                        </div>
                    </div>
                    {status.hasExotel ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <Button 
                            type="primary"
                            onClick={handleCreateSubaccount}
                            loading={loading}
                        >
                            Setup Account
                        </Button>
                    )}
                </div>

                {/* Phone Verification Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Phone className="w-6 h-6 text-primary-600" />
                        <div>
                            <h3 className="font-medium">Phone Verification</h3>
                            <p className="text-sm text-gray-500">
                                {status.phoneVerified 
                                    ? 'Your phone number is verified' 
                                    : 'Verify your phone number to start making calls'}
                            </p>
                        </div>
                    </div>
                    {status.phoneVerified ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ExotelSetup; 
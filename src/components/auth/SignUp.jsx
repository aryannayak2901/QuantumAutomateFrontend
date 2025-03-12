import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { signup, googleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await signup(values);
            setUser(response.user);
            message.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            message.error(error.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            // Initialize Google OAuth - Replace with your Google Client ID
            const googleAuth = window.gapi.auth2.getAuthInstance();
            const googleUser = await googleAuth.signIn();
            const token = googleUser.getAuthResponse().id_token;
            
            const response = await googleLogin(token);
            setUser(response.user);
            message.success('Google signup successful!');
            navigate('/dashboard');
        } catch (error) {
            message.error('Google signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Title level={2}>Create Your Account</Title>
                    <Text className="text-gray-600">Join QuantumAI today</Text>
                </div>

                <Form
                    form={form}
                    name="signup"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Full Name"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Please input your phone number!' },
                            { pattern: /^\+?[\d\s-]+$/, message: 'Please enter a valid phone number!' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Phone Number"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="businessType"
                        rules={[{ required: true, message: 'Please select your business type!' }]}
                    >
                        <Select
                            placeholder="Select Business Type"
                            size="large"
                        >
                            <Option value="ecommerce">E-commerce</Option>
                            <Option value="service">Service Business</Option>
                            <Option value="retail">Retail</Option>
                            <Option value="saas">SaaS</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <Button
                    icon={<GoogleOutlined />}
                    size="large"
                    block
                    onClick={handleGoogleSignup}
                    className="mb-4"
                >
                    Sign up with Google
                </Button>

                <div className="text-center mt-4">
                    <Text className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </Text>
                </div>

                <div className="text-center mt-4 text-sm text-gray-500">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default SignUp; 
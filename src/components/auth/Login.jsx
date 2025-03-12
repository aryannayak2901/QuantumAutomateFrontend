import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login, googleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await login(values);
            setUser(response.user);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            message.error(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Initialize Google OAuth - Replace with your Google Client ID
            const googleAuth = window.gapi.auth2.getAuthInstance();
            const googleUser = await googleAuth.signIn();
            const token = googleUser.getAuthResponse().id_token;
            
            const response = await googleLogin(token);
            setUser(response.user);
            message.success('Google login successful!');
            navigate('/dashboard');
        } catch (error) {
            message.error('Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Title level={2}>Welcome Back</Title>
                    <Text className="text-gray-600">Sign in to your account</Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Forgot password?
                        </Link>
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
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <Button
                    icon={<GoogleOutlined />}
                    size="large"
                    block
                    onClick={handleGoogleLogin}
                    className="mb-4"
                >
                    Sign in with Google
                </Button>

                <div className="text-center mt-4">
                    <Text className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </Text>
                </div>

                <div className="text-center mt-4 text-sm text-gray-500">
                    By signing in, you agree to our{' '}
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

export default Login; 
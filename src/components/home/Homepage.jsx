import React from 'react';
import { Button, Row, Col, Card, Typography, Space } from 'antd';
import {
    RocketOutlined,
    ApiOutlined,
    BarChartOutlined,
    RobotOutlined,
    InstagramOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Homepage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <InstagramOutlined className="text-4xl text-blue-500" />,
            title: 'Instagram Lead Generation',
            description: 'Automatically capture and qualify leads from Instagram DMs and comments.'
        },
        {
            icon: <RobotOutlined className="text-4xl text-green-500" />,
            title: 'AI-Powered Calling',
            description: 'Make intelligent calls with our advanced AI voice technology.'
        },
        {
            icon: <BarChartOutlined className="text-4xl text-purple-500" />,
            title: 'Analytics Dashboard',
            description: 'Get actionable insights with our comprehensive analytics suite.'
        },
        {
            icon: <ApiOutlined className="text-4xl text-orange-500" />,
            title: 'Seamless Integration',
            description: 'Connect with your favorite tools and automate your workflow.'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <RocketOutlined className="text-2xl text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-gray-800">QuantumAI</span>
                        </div>
                        <div className="flex space-x-4">
                            <Button type="link" onClick={() => navigate('/about')}>About</Button>
                            <Button type="link" onClick={() => navigate('/pricing')}>Pricing</Button>
                            <Button type="primary" onClick={() => navigate('/register')}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <Title level={1} className="text-white mb-6">
                                Transform Your Business with{' '}
                                <span className="text-blue-300">AI Automation</span>
                            </Title>
                            <Paragraph className="text-gray-200 text-lg mb-8">
                                From lead extraction to AI-driven calls and actionable analytics—streamline your
                                business with our cutting-edge tools.
                            </Paragraph>
                            <Space size="large">
                                <Button type="primary" size="large" onClick={() => navigate('/register')}>
                                    Get Started
                                </Button>
                                <Button size="large" ghost onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}>
                                    Watch Demo
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} lg={12} className="flex justify-center">
                            <img 
                                src="/hero-image.png" 
                                alt="AI Automation" 
                                className="max-w-full h-auto"
                                style={{ maxHeight: '400px' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Title level={2}>
                            Powerful Features for Your Business
                        </Title>
                        <Paragraph className="text-gray-600 text-lg">
                            Everything you need to automate and scale your operations
                        </Paragraph>
                    </div>
                    <Row gutter={[32, 32]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card 
                                    className="h-full hover:shadow-lg transition-shadow duration-300"
                                    bordered={false}
                                >
                                    <div className="text-center">
                                        {feature.icon}
                                        <Title level={4} className="mt-4 mb-2">
                                            {feature.title}
                                        </Title>
                                        <Paragraph className="text-gray-600">
                                            {feature.description}
                                        </Paragraph>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Title level={2} className="text-white mb-6">
                        Ready to Transform Your Business?
                    </Title>
                    <Paragraph className="text-blue-100 text-lg mb-8">
                        Join thousands of businesses already using QuantumAI to automate their operations
                    </Paragraph>
                    <Button 
                        type="primary" 
                        size="large"
                        className="bg-white text-blue-600 hover:bg-gray-100"
                        onClick={() => navigate('/register')}
                    >
                        Start Free Trial
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">
                                QuantumAI
                            </Title>
                            <Paragraph className="text-gray-400">
                                Transforming businesses with AI automation
                            </Paragraph>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">
                                Product
                            </Title>
                            <Space direction="vertical">
                                <Button type="link" className="text-gray-400 p-0">Features</Button>
                                <Button type="link" className="text-gray-400 p-0">Pricing</Button>
                                <Button type="link" className="text-gray-400 p-0">Documentation</Button>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">
                                Company
                            </Title>
                            <Space direction="vertical">
                                <Button type="link" className="text-gray-400 p-0">About</Button>
                                <Button type="link" className="text-gray-400 p-0">Blog</Button>
                                <Button type="link" className="text-gray-400 p-0">Careers</Button>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">
                                Contact
                            </Title>
                            <Space direction="vertical">
                                <Button type="link" className="text-gray-400 p-0">
                                    <PhoneOutlined className="mr-2" />
                                    Contact Sales
                                </Button>
                                <Button type="link" className="text-gray-400 p-0">
                                    <InstagramOutlined className="mr-2" />
                                    Follow Us
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </footer>
        </div>
    );
};

export default Homepage; 
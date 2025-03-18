import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Typography, Space, Carousel, Statistic, Divider, Avatar } from 'antd';
import {
    RocketOutlined,
    ApiOutlined,
    BarChartOutlined,
    RobotOutlined,
    InstagramOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    StarOutlined,
    TeamOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ActivityTimeline from '../ActivityTimeline/ActivityTimeline';
import VerticalTimeLineSection from '../VerticalTimeLineSection/VerticalTimeLineSection';

const { Title, Paragraph, Text } = Typography;

const Homepage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    
    // Initialize AOS animation library
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
        
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Testimonials data
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Marketing Director',
            company: 'TechGrowth Inc.',
            content: "QuantumAI has transformed our lead generation process. We've seen a 300% increase in qualified leads from Instagram.",
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Michael Chen',
            role: 'Sales Manager',
            company: 'Innovate Solutions',
            content: "The AI calling feature has saved our team countless hours. The voice quality is so natural that clients can't tell they're speaking with an AI.",
            avatar: 'https://randomuser.me/api/portraits/men/46.jpg'
        },
        {
            name: 'Priya Patel',
            role: 'CEO',
            company: 'GrowthHackers',
            content: 'Since implementing QuantumAI, our conversion rates have doubled and our sales team can focus on closing deals instead of cold calling.',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
        }
    ];
    
    // Statistics data
    const statistics = [
        { title: 'Active Users', value: '2,500+', icon: <TeamOutlined /> },
        { title: 'Leads Generated', value: '1.2M+', icon: <InstagramOutlined /> },
        { title: 'Calls Automated', value: '500K+', icon: <PhoneOutlined /> },
        { title: 'Success Rate', value: '89%', icon: <CheckCircleOutlined /> }
    ];
    
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
            <nav className={`navbar fixed w-full z-10 ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <RocketOutlined className="text-2xl text-blue-600 mr-2 pulse-animation" />
                            <span className="text-xl font-bold text-gray-800">QuantumAI</span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <Button type="link" onClick={() => navigate('/about')}>About</Button>
                            <Button type="link" onClick={() => navigate('/pricing')}>Pricing</Button>
                            <Button 
                                type="primary" 
                                shape="round"
                                size="middle"
                                className="hover:scale-105 transition-transform"
                                onClick={() => navigate('/register')}
                            >
                                Get Started
                            </Button>
                        </div>
                        <div className="md:hidden">
                            <Button type="text" icon={<RocketOutlined />} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-20 hero-gradient text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12} data-aos="fade-right">
                            <div className="slide-in-left">
                                <Title level={1} className="text-white mb-6 text-4xl md:text-5xl font-bold">
                                    Transform Your Business with{' '}
                                    <span className="text-blue-300 bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">AI Automation</span>
                                </Title>
                                <Paragraph className="text-gray-200 text-lg mb-8">
                                    From Instagram lead extraction to AI-driven calls and actionable analytics—streamline your
                                    business with our cutting-edge automation platform.
                                </Paragraph>
                                <Space size="large" className="flex flex-wrap gap-4">
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        shape="round"
                                        className="pulse-animation"
                                        onClick={() => navigate('/register')}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button 
                                        size="large" 
                                        shape="round"
                                        ghost 
                                        className="hover:scale-105 transition-transform"
                                        onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                                    >
                                        Watch Demo
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                        <Col xs={24} lg={12} className="flex justify-center" data-aos="fade-left">
                            <div className="float-animation">
                                <svg width="500" height="400" viewBox="0 0 500 400" className="max-w-full h-auto">
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#3182ce', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#805ad5', stopOpacity: 1 }} />
                                        </linearGradient>
                                    </defs>
                                    <rect x="50" y="50" rx="20" ry="20" width="400" height="300" style={{ fill: 'rgba(255,255,255,0.1)', stroke: 'url(#grad1)', strokeWidth: 2 }} />
                                    <circle cx="250" cy="150" r="70" style={{ fill: 'url(#grad1)' }} />
                                    <path d="M150,250 Q250,300 350,250" style={{ fill: 'none', stroke: 'white', strokeWidth: 3 }} />
                                    <text x="250" y="150" dominantBaseline="middle" textAnchor="middle" style={{ fill: 'white', fontSize: '24px' }}>QuantumAI</text>
                                    <circle cx="180" cy="100" r="10" style={{ fill: '#4299e1' }}>
                                        <animate attributeName="cy" values="100;90;100" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="320" cy="100" r="10" style={{ fill: '#4299e1' }}>
                                        <animate attributeName="cy" values="100;110;100" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                </svg>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <Title level={2} className="text-3xl md:text-4xl font-bold">
                            Powerful Features for Your Business
                        </Title>
                        <Paragraph className="text-gray-600 text-lg">
                            Everything you need to automate and scale your operations
                        </Paragraph>
                    </div>
                    <Row gutter={[32, 32]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <Card 
                                    className={`feature-card h-full slide-in-bottom stagger-${index + 1}`}
                                    bordered={false}
                                    hoverable
                                >
                                    <div className="text-center">
                                        <div className="feature-icon bg-gradient-to-r from-blue-500 to-purple-500 inline-flex p-3 rounded-full text-white mb-4">
                                            {feature.icon}
                                        </div>
                                        <Title level={4} className="mt-4 mb-2 font-bold">
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

            {/* Statistics Section */}
            <div className="py-16 stats-section text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[32, 32]} justify="center">
                        {statistics.map((stat, index) => (
                            <Col xs={12} md={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="stat-card p-6 text-center h-full">
                                    <div className="text-4xl mb-4">{stat.icon}</div>
                                    <Statistic 
                                        title={<span className="text-white opacity-80">{stat.title}</span>}
                                        value={stat.value}
                                        valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <Title level={2} className="text-3xl md:text-4xl font-bold">
                            What Our Clients Say
                        </Title>
                        <Paragraph className="text-gray-600 text-lg">
                            Success stories from businesses using our platform
                        </Paragraph>
                    </div>
                    
                    <div data-aos="fade-up">
                        <Carousel autoplay autoplaySpeed={5000} dots={true} effect="fade">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="px-4 pb-10">
                                    <div className="testimonial-card p-8 text-center">
                                        <div className="mb-6">
                                            <div className="flex justify-center mb-4">
                                                <Avatar 
                                                    src={testimonial.avatar} 
                                                    size={80} 
                                                    className="border-4 border-blue-100"
                                                />
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <StarOutlined key={star} className="text-yellow-400 text-lg" />
                                                ))}
                                            </div>
                                            <Paragraph className="text-gray-800 text-lg italic mb-6">
                                                "{testimonial.content}"
                                            </Paragraph>
                                            <Title level={5} className="mb-0">{testimonial.name}</Title>
                                            <Text className="text-gray-500">{testimonial.role}, {testimonial.company}</Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <Title level={2} className="text-3xl md:text-4xl font-bold">
                            How QuantumAI Works
                        </Title>
                        <Paragraph className="text-gray-600 text-lg">
                            Our streamlined process makes automation simple
                        </Paragraph>
                    </div>
                    
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={8} data-aos="fade-right">
                            <div className="text-center">
                                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <InstagramOutlined className="text-2xl text-blue-500" />
                                </div>
                                <Title level={4}>1. Connect Instagram</Title>
                                <Paragraph className="text-gray-600">
                                    Link your Instagram business account to start capturing leads from comments and DMs automatically.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8} data-aos="fade-up" data-aos-delay="100">
                            <div className="text-center">
                                <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <RobotOutlined className="text-2xl text-purple-500" />
                                </div>
                                <Title level={4}>2. Configure AI Calling</Title>
                                <Paragraph className="text-gray-600">
                                    Set up your AI calling agent with custom scripts tailored to your business needs.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8} data-aos="fade-left" data-aos-delay="200">
                            <div className="text-center">
                                <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <BarChartOutlined className="text-2xl text-green-500" />
                                </div>
                                <Title level={4}>3. Track Results</Title>
                                <Paragraph className="text-gray-600">
                                    Monitor performance with our comprehensive analytics dashboard and optimize your campaigns.
                                </Paragraph>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-gradient py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div data-aos="fade-up">
                        <Title level={2} className="text-white mb-6 text-3xl md:text-4xl font-bold">
                            Ready to Transform Your Business?
                        </Title>
                        <Paragraph className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
                            Join thousands of businesses already using QuantumAI to automate their operations and scale their growth
                        </Paragraph>
                        <Space size="large" className="flex flex-wrap justify-center gap-4">
                            <Button 
                                type="primary" 
                                size="large"
                                shape="round"
                                className="bg-white text-blue-600 hover:bg-gray-100 pulse-animation"
                                onClick={() => navigate('/register')}
                            >
                                Start Free Trial
                            </Button>
                            <Button 
                                ghost 
                                size="large"
                                shape="round"
                                className="border-white text-white hover:text-blue-200 hover:border-blue-200"
                                onClick={() => navigate('/pricing')}
                            >
                                View Pricing
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            <ActivityTimeline />

            <VerticalTimeLineSection />

            {/* Footer */}
            <footer className="footer text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[32, 48]}>
                        <Col xs={24} md={8} lg={8}>
                            <div data-aos="fade-right">
                                <div className="flex items-center mb-6">
                                    <RocketOutlined className="text-3xl text-blue-400 mr-3" />
                                    <Title level={3} className="text-white m-0">
                                        QuantumAI
                                    </Title>
                                </div>
                                <Paragraph className="text-gray-400 mb-6">
                                    Transforming businesses with AI automation. Our platform helps you generate leads, automate calls, and scale your operations.
                                </Paragraph>
                                <Space className="flex gap-4">
                                    <Button type="text" shape="circle" icon={<InstagramOutlined />} className="text-blue-400 hover:text-white hover:bg-blue-500" />
                                    <Button type="text" shape="circle" icon={<GlobalOutlined />} className="text-blue-400 hover:text-white hover:bg-blue-500" />
                                    <Button type="text" shape="circle" icon={<PhoneOutlined />} className="text-blue-400 hover:text-white hover:bg-blue-500" />
                                </Space>
                            </div>
                        </Col>
                        <Col xs={24} md={16} lg={16}>
                            <Row gutter={[32, 32]}>
                                <Col xs={12} sm={8} data-aos="fade-up" data-aos-delay="100">
                                    <Title level={4} className="text-white mb-4">
                                        Product
                                    </Title>
                                    <Space direction="vertical" className="w-full">
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Features</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Pricing</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Documentation</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">API</Button>
                                    </Space>
                                </Col>
                                <Col xs={12} sm={8} data-aos="fade-up" data-aos-delay="200">
                                    <Title level={4} className="text-white mb-4">
                                        Company
                                    </Title>
                                    <Space direction="vertical" className="w-full">
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">About</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Blog</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Careers</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Contact</Button>
                                    </Space>
                                </Col>
                                <Col xs={12} sm={8} data-aos="fade-up" data-aos-delay="300">
                                    <Title level={4} className="text-white mb-4">
                                        Support
                                    </Title>
                                    <Space direction="vertical" className="w-full">
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Help Center</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Community</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Status</Button>
                                        <Button type="link" className="text-gray-400 p-0 hover:text-blue-400 transition-colors text-left">Webinars</Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Divider className="bg-gray-800 my-8" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <Text className="text-gray-500 mb-4 md:mb-0">© 2023 QuantumAI. All rights reserved.</Text>
                        <Space split={<Divider type="vertical" className="bg-gray-700" />}>
                            <Button type="link" className="text-gray-500 p-0 hover:text-blue-400">Privacy Policy</Button>
                            <Button type="link" className="text-gray-500 p-0 hover:text-blue-400">Terms of Service</Button>
                            <Button type="link" className="text-gray-500 p-0 hover:text-blue-400">Cookies</Button>
                        </Space>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
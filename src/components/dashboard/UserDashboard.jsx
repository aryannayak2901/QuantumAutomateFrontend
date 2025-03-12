import React from 'react';
import { Row, Col, Card, Statistic, Button, Typography } from 'antd';
import {
    MessageOutlined,
    PhoneOutlined,
    InstagramOutlined,
    RiseOutlined,
    TeamOutlined,
    CalendarOutlined,
    CommentOutlined
} from '@ant-design/icons';
import DashboardLayout from './DashboardLayout';

const { Title } = Typography;

const UserDashboard = () => {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <Title level={3}>Dashboard Overview</Title>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Leads"
                            value={1234}
                            prefix={<TeamOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title="Active Campaigns"
                            value={12}
                            prefix={<RiseOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title="Scheduled Calls"
                            value={45}
                            prefix={<CalendarOutlined className="text-purple-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title="New Messages"
                            value={89}
                            prefix={<CommentOutlined className="text-orange-500" />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content Area */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card 
                        title="Recent Activity" 
                        bordered={false}
                        className="hover:shadow-md transition-shadow"
                    >
                        {/* Add activity feed component here */}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title="Quick Actions" 
                        bordered={false}
                        className="hover:shadow-md transition-shadow"
                    >
                        <div className="space-y-4">
                            <Button 
                                type="primary" 
                                icon={<MessageOutlined />} 
                                block
                            >
                                Create Campaign
                            </Button>
                            <Button 
                                icon={<PhoneOutlined />} 
                                block
                            >
                                Schedule Call
                            </Button>
                            <Button 
                                icon={<InstagramOutlined />} 
                                block
                            >
                                Connect Instagram
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </DashboardLayout>
    );
};

export default UserDashboard; 
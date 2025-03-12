import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Table, message } from 'antd';
import { InstagramOutlined, MessageOutlined, UserAddOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';

const InstagramDashboard = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connectedAccounts, setConnectedAccounts] = useState([]);

    useEffect(() => {
        fetchInsights();
        fetchConnectedAccounts();
    }, []);

    const fetchInsights = async () => {
        try {
            const response = await axios.get('/api/instagram/insights/');
            setInsights(response.data);
        } catch (error) {
            message.error('Failed to fetch Instagram insights');
        } finally {
            setLoading(false);
        }
    };

    const fetchConnectedAccounts = async () => {
        try {
            const response = await axios.get('/api/instagram/accounts/');
            setConnectedAccounts(response.data);
        } catch (error) {
            message.error('Failed to fetch connected accounts');
        }
    };

    const handleConnectInstagram = async () => {
        // Implement Instagram login flow
        window.location.href = '/api/instagram/accounts/connect/';
    };

    return (
        <div className="instagram-dashboard p-6">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Instagram Management</h1>
                <Button 
                    type="primary" 
                    icon={<InstagramOutlined />}
                    onClick={handleConnectInstagram}
                >
                    Connect Instagram Account
                </Button>
            </div>

            {/* Stats Overview */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Comments"
                            value={insights?.comment_metrics?.total_comments || 0}
                            prefix={<MessageOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Converted Leads"
                            value={insights?.comment_metrics?.converted_leads || 0}
                            prefix={<UserAddOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Engagement Rate"
                            value={insights?.comment_metrics?.engagement_rate || 0}
                            suffix="%"
                            prefix={<LineChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="DM Success Rate"
                            value={insights?.dm_metrics?.success_rate || 0}
                            suffix="%"
                            prefix={<MessageOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Connected Accounts */}
            <Card title="Connected Accounts" className="mb-6">
                <Table
                    dataSource={connectedAccounts}
                    columns={[
                        {
                            title: 'Account',
                            dataIndex: 'instagram_user_id',
                            key: 'instagram_user_id',
                        },
                        {
                            title: 'Status',
                            dataIndex: 'is_active',
                            key: 'is_active',
                            render: (isActive) => (
                                <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            ),
                        },
                        {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, record) => (
                                <Button.Group>
                                    <Button>View Details</Button>
                                    <Button danger={record.is_active}>
                                        {record.is_active ? 'Disconnect' : 'Reconnect'}
                                    </Button>
                                </Button.Group>
                            ),
                        },
                    ]}
                    loading={loading}
                />
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                <Table
                    dataSource={[]} // Implement recent activity data
                    columns={[
                        {
                            title: 'Time',
                            dataIndex: 'timestamp',
                            key: 'timestamp',
                        },
                        {
                            title: 'Type',
                            dataIndex: 'type',
                            key: 'type',
                        },
                        {
                            title: 'Description',
                            dataIndex: 'description',
                            key: 'description',
                        },
                        {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                        },
                    ]}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default InstagramDashboard; 
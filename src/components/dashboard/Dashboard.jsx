import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Button } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    InstagramOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLeads: 0,
        activeCampaigns: 0,
        scheduledCalls: 0,
        conversionRate: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const recentLeadsColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (source) => (
                <span>
                    {source === 'instagram' ? <InstagramOutlined /> : <UserOutlined />}
                    {' '}{source}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => console.log('View lead:', record)}>
                    View Details
                </Button>
            ),
        },
    ];

    const upcomingCallsColumns = [
        {
            title: 'Lead',
            dataIndex: 'lead_name',
            key: 'lead_name',
        },
        {
            title: 'Time',
            dataIndex: 'scheduled_time',
            key: 'scheduled_time',
        },
        {
            title: 'Type',
            dataIndex: 'call_type',
            key: 'call_type',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button.Group>
                    <Button type="primary" size="small">
                        Start Call
                    </Button>
                    <Button size="small">
                        Reschedule
                    </Button>
                </Button.Group>
            ),
        },
    ];

    return (
        <div className="dashboard p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats Overview */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Leads"
                            value={stats.totalLeads}
                            prefix={<UserOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Campaigns"
                            value={stats.activeCampaigns}
                            prefix={<InstagramOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Scheduled Calls"
                            value={stats.scheduledCalls}
                            prefix={<PhoneOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Conversion Rate"
                            value={stats.conversionRate}
                            suffix="%"
                            prefix={<CalendarOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Leads */}
            <Card title="Recent Leads" className="mb-6">
                <Table
                    columns={recentLeadsColumns}
                    dataSource={[]}  // Add your data here
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            {/* Upcoming Calls */}
            <Card title="Upcoming Calls">
                <Table
                    columns={upcomingCallsColumns}
                    dataSource={[]}  // Add your data here
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <style jsx>{`
                .status-badge {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                }
                .status-badge.new {
                    background-color: #e6f7ff;
                    color: #1890ff;
                }
                .status-badge.contacted {
                    background-color: #fff7e6;
                    color: #fa8c16;
                }
                .status-badge.qualified {
                    background-color: #f6ffed;
                    color: #52c41a;
                }
                .status-badge.converted {
                    background-color: #52c41a;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default Dashboard; 
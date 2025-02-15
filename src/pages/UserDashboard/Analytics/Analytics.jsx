import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Select, DatePicker, Table, Progress, Tooltip } from "antd";
import { ArrowUpRight, ArrowDownRight, Users, Phone, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

import "../../../styles/global.css"

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const { RangePicker } = DatePicker;
const { Option } = Select;

const Analytics = () => {
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('week');
    const [dateRange, setDateRange] = useState([]);

    // Sample data - Replace with actual API calls
    const metrics = {
        totalLeads: { value: 2547, trend: '+12.5%', icon: Users },
        activeCallCampaigns: { value: 15, trend: '+8.3%', icon: Phone },
        appointmentsSet: { value: 186, trend: '+15.2%', icon: Calendar },
        conversionRate: { value: '24.8%', trend: '-2.1%', icon: TrendingUp },
    };

    const leadSourceData = {
        labels: ['Social Media', 'Website', 'Referrals', 'Direct', 'Other'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0,
        }]
    };

    const conversionTrendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Leads',
                data: [65, 59, 80, 81, 56, 55, 70],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Conversions',
                data: [28, 48, 40, 19, 86, 27, 40],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const campaignPerformanceData = {
        labels: ['Campaign A', 'Campaign B', 'Campaign C', 'Campaign D', 'Campaign E'],
        datasets: [{
            label: 'Success Rate',
            data: [85, 72, 65, 89, 78],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        }]
    };

    const campaignColumns = [
        {
            title: 'Campaign Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={`px-3 py-1 rounded-full text-sm ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => (
                <Progress percent={progress} size="small" strokeColor="#3b82f6" />
            ),
        },
        {
            title: 'Conversion Rate',
            dataIndex: 'conversionRate',
            key: 'conversionRate',
            render: (rate) => (
                <div className="flex items-center">
                    <span className="font-semibold">{rate}%</span>
                    {parseFloat(rate) >= 50 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 ml-2" />
                    ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 ml-2" />
                    )}
                </div>
            ),
        },
    ];

    const campaignData = [
        { key: '1', name: 'Summer Sale', status: 'Active', progress: 75, conversionRate: '68' },
        { key: '2', name: 'New Product Launch', status: 'Active', progress: 45, conversionRate: '52' },
        { key: '3', name: 'Holiday Special', status: 'Paused', progress: 90, conversionRate: '43' },
        { key: '4', name: 'Customer Reactivation', status: 'Active', progress: 60, conversionRate: '58' },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                <div className="flex space-x-4">
                    <Select
                        defaultValue="week"
                        onChange={setTimeRange}
                        className="w-32"
                    >
                        <Option value="day">Today</Option>
                        <Option value="week">This Week</Option>
                        <Option value="month">This Month</Option>
                        <Option value="year">This Year</Option>
                    </Select>
                    <RangePicker onChange={setDateRange} />
                </div>
            </div>

            {/* Metrics Cards */}
            <Row gutter={[16, 16]} className="mb-8">
                {Object.entries(metrics).map(([key, { value, trend, icon: Icon }]) => (
                    <Col xs={24} sm={12} lg={6} key={key}>
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                                </div>
                                <div className={`flex items-center ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {trend.startsWith('+') ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    <span className="ml-1">{trend}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Icon className="w-6 h-6 text-blue-500" />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Charts Section */}
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} lg={16}>
                    <Card title="Conversion Trends" className="h-full">
                        <Line
                            data={conversionTrendData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Lead Sources" className="h-full">
                        <Doughnut
                            data={leadSourceData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                                cutout: '70%',
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Campaign Performance */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Campaign Success Rates" className="h-full">
                        <Bar
                            data={campaignPerformanceData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100,
                                    },
                                },
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Active Campaigns" className="h-full">
                        <Table
                            columns={campaignColumns}
                            dataSource={campaignData}
                            pagination={false}
                            className="campaign-table"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics;
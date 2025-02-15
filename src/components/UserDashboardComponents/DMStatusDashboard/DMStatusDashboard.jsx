import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Select, message, Spin, Card, Row, Col, Statistic } from "antd";
import { ReloadOutlined, SearchOutlined, SendOutlined, CheckCircleOutlined, CloseCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Bar, Line } from "react-chartjs-2";
import { Heatmap } from "@ant-design/plots";

const { Option } = Select;

const DMStatusDashboard = () => {
    const [dmLogs, setDmLogs] = useState([]);
    const [dmTrends, setDmTrends] = useState([]);
    const [dmHeatmap, setDmHeatmap] = useState([]);
    const [successRateTrend, setSuccessRateTrend] = useState([]);
    const [campaignBreakdown, setCampaignBreakdown] = useState([]);

    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [usernameFilter, setUsernameFilter] = useState("");
    const [stats, setStats] = useState({
        totalDMs: 0,
        successRate: 0,
        failedDMs: 0,
        avgRetryAttempts: 0
    });

    useEffect(() => {
        fetchDmHistory();
        fetchDmAnalytics();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [dmLogs]);

    const calculateStats = () => {
        const total = dmLogs.length;
        const failed = dmLogs.filter(dm => dm.status === 'failed').length;
        const totalRetries = dmLogs.reduce((sum, dm) => sum + dm.retry_count, 0);
        
        setStats({
            totalDMs: total,
            successRate: total ? ((total - failed) / total * 100).toFixed(1) : 0,
            failedDMs: failed,
            avgRetryAttempts: total ? (totalRetries / total).toFixed(1) : 0
        });
    };

    const fetchDmHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/dm-history/`, {
                params: { campaign: selectedCampaign || undefined },
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            setDmLogs(response.data.dm_history);
        } catch (error) {
            message.error("Failed to fetch DM history");
        }
        setLoading(false);
    };

    const fetchDmAnalytics = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/dm-analytics/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            setDmTrends(response.data.dm_trends);
            setDmHeatmap(response.data.dm_heatmap);
            setCampaignBreakdown(response.data.campaign_breakdown);
            setTotalSent(response.data.total_sent);
            setTotalFailed(response.data.total_failed);
        } catch (error) {
            message.error("Failed to fetch DM analytics");
        }
    };

    const dmChartData = {
        labels: dmTrends.map((data) => data.date),
        datasets: [
            {
                label: "DMs Sent",
                data: dmTrends.map((data) => data.sent),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "DMs Failed",
                data: dmTrends.map((data) => data.failed),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    const successRateChartData = {
        labels: successRateTrend.map((data) => data.date),
        datasets: [
            {
                label: "Success Rate (%)",
                data: successRateTrend.map((data) => data.rate),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
            },
        ],
    };

    const heatmapConfig = {
        data: dmHeatmap,
        xField: "hour",
        yField: "date",
        colorField: "count",
        color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        legend: { layout: "horizontal", position: "bottom" },
    };

    const campaignChartData = {
        labels: campaignBreakdown.map((data) => data.campaign),
        datasets: [
            { label: "DMs Sent", data: campaignBreakdown.map((data) => data.sent), backgroundColor: "rgba(75, 192, 192, 0.6)" },
            { label: "DMs Failed", data: campaignBreakdown.map((data) => data.failed), backgroundColor: "rgba(255, 99, 132, 0.6)" },
        ],
    };

    const retryFailedDM = async (dmId) => {
        try {
            await axios.post(
                `http://localhost:8000/api/dm-retry/`,
                { dm_id: dmId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );
            message.success("DM retry initiated!");
            fetchDmHistory();
        } catch (error) {
            message.error("Failed to retry DM");
        }
    };

    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            render: (text) => (
                <span className="font-semibold text-gray-800 hover:text-primary-600 cursor-pointer">
                    {text}
                </span>
            ),
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            ellipsis: true,
            render: (text) => (
                <div className="max-w-md">
                    <p className="text-gray-600 truncate">{text}</p>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const config = {
                    sent: {
                        color: 'success',
                        icon: <CheckCircleOutlined />,
                    },
                    failed: {
                        color: 'error',
                        icon: <CloseCircleOutlined />,
                    }
                };
                return (
                    <Tag icon={config[status].icon} color={config[status].color}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Retry Attempts",
            dataIndex: "retry_count",
            key: "retry_count",
            render: (count) => (
                <Tag icon={<RetweetOutlined />} color="blue">
                    {count}
                </Tag>
            ),
        },
        {
            title: "Sent Time",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => (
                <span className="text-gray-500">
                    {new Date(text).toLocaleString()}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    {record.status === "failed" && (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => retryFailedDM(record.id)}
                            className="hover:scale-105 transition-transform"
                        >
                            Retry DM
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">DM Status Dashboard</h1>
                <p className="text-gray-600">Monitor and manage your direct message communications</p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <Statistic
                            title="Total DMs"
                            value={stats.totalDMs}
                            prefix={<SendOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <Statistic
                            title="Success Rate"
                            value={stats.successRate}
                            suffix="%"
                            prefix={stats.successRate >= 50 ? 
                                <ArrowUpRight className="text-green-500" /> : 
                                <ArrowDownRight className="text-red-500" />
                            }
                            valueStyle={{ color: stats.successRate >= 50 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <Statistic
                            title="Failed DMs"
                            value={stats.failedDMs}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <Statistic
                            title="Avg. Retry Attempts"
                            value={stats.avgRetryAttempts}
                            prefix={<RetweetOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="DM Trends (Past 7 Days)">
                        <Bar data={dmChartData} options={{ responsive: true }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Success Rate Trend (Past 7 Days)">
                        <Line data={successRateChartData} options={{ responsive: true }} />
                    </Card>
                </Col>
            </Row>

            <Card title="DM Activity Heatmap (Hourly)" style={{ marginTop: "20px" }}>
                <Heatmap {...heatmapConfig} />
            </Card>

            <Card title="DM Campaign Breakdown (Last 7 Days)" style={{ marginTop: "20px" }}>
                <Bar data={campaignChartData} options={{ responsive: true }} />
            </Card>


            {/* Filters Section */}
            <Card className="mb-8">
                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Search by username"
                        value={usernameFilter}
                        onChange={(e) => setUsernameFilter(e.target.value)}
                        prefix={<SearchOutlined />}
                        className="max-w-xs"
                    />
                    <Select
                        placeholder="Filter by Status"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        className="min-w-[200px]"
                    >
                        <Option value="">All</Option>
                        <Option value="sent">Sent</Option>
                        <Option value="failed">Failed</Option>
                    </Select>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={fetchDmHistory}
                        className="hover:scale-105 transition-transform"
                    >
                        Search
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setStatusFilter("");
                            setUsernameFilter("");
                            fetchDmHistory();
                        }}
                        className="hover:scale-105 transition-transform"
                    >
                        Reset
                    </Button>
                </div>
            </Card>

            {/* Table Section */}
            <Card>
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={dmLogs}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} items`,
                        }}
                        className="dm-status-table"
                        scroll={{ x: 'max-content' }}
                    />
                )}
            </Card>
        </div>
    );
};

export default DMStatusDashboard;
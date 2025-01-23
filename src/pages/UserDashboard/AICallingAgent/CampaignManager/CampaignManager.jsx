import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, DatePicker, Select, Space, Dropdown, Menu, message } from "antd";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CampaignManager = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [customScripts, setCustomScripts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [form] = Form.useForm();
    const [filters, setFilters] = useState({ name: "", status: "" });

    // Fetch campaigns from the backend
    const fetchCampaigns = async () => {
        try {
            const response = await axios.get("http://localhost:3000/CampaignManager");
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            message.error("Failed to fetch campaigns.");
        }
    };

    // Fetch custom AI scripts from the backend
    const fetchCustomScripts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/customScripts");
            setCustomScripts(response.data);
        } catch (error) {
            console.error("Error fetching custom scripts:", error);
            message.error("Failed to fetch custom scripts.");
        }
    };

    useEffect(() => {
        fetchCampaigns();
        fetchCustomScripts();
    }, []);

    // Handle Create Campaign
    const handleCreateCampaign = async (values) => {
        try {
            await axios.post("http://localhost:3000/CampaignManager", values);
            message.success("Campaign created successfully!");
            fetchCampaigns();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating campaign:", error);
            message.error("Failed to create campaign.");
        }
    };

    // Handle Edit Campaign
    const handleEditCampaign = async (values) => {
        try {
            await axios.put(`http://localhost:3000/CampaignManager/${editingCampaign.id}`, values);
            message.success("Campaign updated successfully!");
            fetchCampaigns();
            setIsEditModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error updating campaign:", error);
            message.error("Failed to update campaign.");
        }
    };

    // Open Edit Modal
    const openEditModal = (campaign) => {
        setEditingCampaign(campaign);
        form.setFieldsValue({
            name: campaign.name,
            startTime: campaign.startTime,
            retryRules: campaign.retryRules,
            leads: campaign.leads,
            script: campaign.script,
        });
        setIsEditModalVisible(true);
    };

    // Dropdown Actions
    const handleAction = async (id, action) => {
        try {
            await axios.post(`http://localhost:3000/CampaignManager/${id}/${action}`);
            message.success(`Campaign ${action} successfully!`);
            fetchCampaigns();
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            message.error(`Failed to ${action} campaign.`);
        }
    };

    // Filter Campaigns
    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const filteredCampaigns = campaigns.filter((campaign) => {
        return (
            (!filters.name || campaign.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (!filters.status || campaign.status === filters.status)
        );
    });

    const columns = [
        {
            title: "Campaign Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item onClick={() => handleAction(record.id, "start")}>
                                Start
                            </Menu.Item>
                            <Menu.Item onClick={() => handleAction(record.id, "pause")}>
                                Pause
                            </Menu.Item>
                            <Menu.Item onClick={() => handleAction(record.id, "stop")}>
                                Stop
                            </Menu.Item>
                            <Menu.Item onClick={() => openEditModal(record)}>
                                Edit
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button type="link">
                        Actions <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <h2>Campaign Manager</h2>

            {/* Filters */}
            <div style={{ marginBottom: 20, display: "flex", gap: "10px" }}>
                <Input
                    placeholder="Search by campaign name"
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                />
                <Select
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                    style={{ width: 200 }}
                >
                    <Option value="">All Status</Option>
                    <Option value="Ongoing">Ongoing</Option>
                    <Option value="Paused">Paused</Option>
                    <Option value="Completed">Completed</Option>
                </Select>
                <Button type="default" onClick={() => setFilters({ name: "", status: "" })}>
                    Clear Filters
                </Button>
            </div>

            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 20 }}>
                Create Campaign
            </Button>
            <Table
                dataSource={filteredCampaigns}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            {/* Create Campaign Modal */}
            <Modal
                title="Create Campaign"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateCampaign} layout="vertical">
                    <Form.Item
                        label="Campaign Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter a campaign name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[{ required: true, message: "Please select a start time!" }]}
                    >
                        <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Retry Rules"
                        name="retryRules"
                        rules={[{ required: true, message: "Please define retry rules!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Assign AI Script"
                        name="script"
                        rules={[{ required: true, message: "Please select an AI script!" }]}
                    >
                        <Select placeholder="Select AI script">
                            {customScripts.map((script) => (
                                <Option key={script.id} value={script.id}>
                                    {script.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Upload Leads"
                        name="leads"
                        rules={[{ required: true, message: "Please upload a leads file!" }]}
                    >
                        <Upload>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Campaign
                    </Button>
                </Form>
            </Modal>

            {/* Edit Campaign Modal */}
            <Modal
                title="Edit Campaign"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleEditCampaign} layout="vertical">
                    <Form.Item
                        label="Campaign Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter a campaign name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[{ required: true, message: "Please select a start time!" }]}
                    >
                        <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Retry Rules"
                        name="retryRules"
                        rules={[{ required: true, message: "Please define retry rules!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Assign AI Script"
                        name="script"
                        rules={[{ required: true, message: "Please select an AI script!" }]}
                    >
                        <Select placeholder="Select AI script">
                            {customScripts.map((script) => (
                                <Option key={script.id} value={script.id}>
                                    {script.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Upload Leads"
                        name="leads"
                        rules={[{ required: true, message: "Please upload a leads file!" }]}
                    >
                        <Upload>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default CampaignManager;

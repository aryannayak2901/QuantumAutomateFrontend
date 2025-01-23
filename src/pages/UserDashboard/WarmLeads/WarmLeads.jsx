import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Modal, Form, DatePicker, message, Tag } from "antd";
import axios from "axios";
import moment from "moment"; // Or dayjs if you're using dayjs

const { Option } = Select;

const WarmLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ interestLevel: "", source: "", status: "" });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [form] = Form.useForm();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalLeads, setTotalLeads] = useState(0);

    // Fetch leads
    const fetchLeads = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/WarmLeads", {
                params: {
                    page,
                    pageSize,
                    interestLevel: filters.interestLevel,
                    source: filters.source,
                    status: filters.status,
                },
            });
            setLeads(response.data);
            setTotalLeads(response.data.total); // Total number of leads from the backend
        } catch (error) {
            message.error("Failed to fetch leads.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(currentPage, pageSize);
    }, [currentPage, pageSize, filters]);

    

    const openModal = (lead) => {
        setSelectedLead(lead);
        form.setFieldsValue({
            ...lead,
            nextFollowUp: lead.nextFollowUp ? moment(lead.nextFollowUp) : null, // Convert to moment object
        });
        setIsModalVisible(true);
    };

    const handleSaveLead = async (values) => {
        // Convert moment object to string (if using moment)
        const updatedLead = {
            ...values,
            nextFollowUp: values.nextFollowUp ? values.nextFollowUp.format("YYYY-MM-DD") : null,
        };

        try {
            await axios.put(`http://localhost:3000/WarmLeads/${selectedLead.id}`, updatedLead);
            message.success("Lead updated successfully!");
            fetchLeads(currentPage, pageSize);
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to update lead.");
        }
    };


    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Interest Level",
            dataIndex: "interestLevel",
            key: "interestLevel",
            render: (level) => {
                const color = level === "High" ? "green" : level === "Medium" ? "orange" : "red";
                return <Tag color={color}>{level}</Tag>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Next Follow-Up",
            dataIndex: "nextFollowUp",
            key: "nextFollowUp",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="link" onClick={() => openModal(record)}>
                    View / Edit
                </Button>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <div>
            <h2>Warm Leads</h2>
            <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <Select
                    placeholder="Filter by Interest Level"
                    onChange={(value) => setFilters({ ...filters, interestLevel: value })}
                    style={{ width: 200 }}
                >
                    <Option value="">All</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                </Select>
                <Select
                    placeholder="Filter by Source"
                    onChange={(value) => setFilters({ ...filters, source: value })}
                    style={{ width: 200 }}
                >
                    <Option value="">All</Option>
                    <Option value="Instagram">Instagram</Option>
                    <Option value="Facebook">Facebook</Option>
                    <Option value="Manual">Manual</Option>
                </Select>
                <Select
                    placeholder="Filter by Status"
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    style={{ width: 200 }}
                >
                    <Option value="">All</Option>
                    <Option value="Contacted">Contacted</Option>
                    <Option value="Not Contacted">Not Contacted</Option>
                </Select>
                <Button onClick={() => setFilters({ interestLevel: "", source: "", status: "" })}>
                    Clear Filters
                </Button>
            </div>
            <Table
                dataSource={leads}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalLeads,
                    showSizeChanger: true,
                    onShowSizeChange: (current, size) => setPageSize(size),
                }}
                onChange={handleTableChange}
                scroll={{ x: 1000 }} // Enables horizontal scrolling for wide tables
            />
            <Modal
                title="Edit Lead"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveLead}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contact" label="Contact" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="source" label="Source" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Instagram">Instagram</Option>
                            <Option value="Facebook">Facebook</Option>
                            <Option value="Manual">Manual</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="interestLevel" label="Interest Level" rules={[{ required: true }]}>
                        <Select>
                            <Option value="High">High</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="Low">Low</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="nextFollowUp" label="Next Follow-Up Date">
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WarmLeads;

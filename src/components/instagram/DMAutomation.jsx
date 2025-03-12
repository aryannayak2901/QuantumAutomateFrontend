import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Table, message, Modal } from 'antd';
import { SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const DMAutomation = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/instagram/dm/templates/');
            setTemplates(response.data);
        } catch (error) {
            message.error('Failed to fetch DM templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        try {
            if (selectedTemplate) {
                await axios.put(`/api/instagram/dm/templates/${selectedTemplate.id}/`, values);
                message.success('Template updated successfully');
            } else {
                await axios.post('/api/instagram/dm/templates/', values);
                message.success('Template created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchTemplates();
        } catch (error) {
            message.error('Failed to save template');
        }
    };

    const handleDelete = async (templateId) => {
        try {
            await axios.delete(`/api/instagram/dm/templates/${templateId}/`);
            message.success('Template deleted successfully');
            fetchTemplates();
        } catch (error) {
            message.error('Failed to delete template');
        }
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        form.setFieldsValue(template);
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trigger',
            dataIndex: 'trigger',
            key: 'trigger',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button.Group>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Button.Group>
            ),
        },
    ];

    return (
        <div className="dm-automation p-6">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">DM Automation</h1>
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => {
                        setSelectedTemplate(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}
                >
                    Create Template
                </Button>
            </div>

            {/* Templates Table */}
            <Card>
                <Table
                    dataSource={templates}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            {/* Create/Edit Template Modal */}
            <Modal
                title={selectedTemplate ? 'Edit Template' : 'Create Template'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="name"
                        label="Template Name"
                        rules={[{ required: true, message: 'Please enter template name' }]}
                    >
                        <Input placeholder="Enter template name" />
                    </Form.Item>

                    <Form.Item
                        name="trigger"
                        label="Trigger"
                        rules={[{ required: true, message: 'Please select trigger' }]}
                    >
                        <Select placeholder="Select trigger">
                            <Option value="new_comment">New Comment</Option>
                            <Option value="mention">Mention</Option>
                            <Option value="follow">New Follow</Option>
                            <Option value="custom">Custom Trigger</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="message"
                        label="Message Template"
                        rules={[{ required: true, message: 'Please enter message template' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter message template. Use {name} for recipient's name"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DMAutomation; 
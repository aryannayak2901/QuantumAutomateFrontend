import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, Space, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const LeadForm = ({ lead, onSave, onCancel, mode = 'create' }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (lead && mode === 'edit') {
            // Convert dates to dayjs objects for DatePicker
            const formData = {
                ...lead,
                last_contacted: lead.last_contacted ? dayjs(lead.last_contacted) : null
            };
            form.setFieldsValue(formData);
        }
    }, [lead, form, mode]);

    const handleSubmit = async (values) => {
        try {
            // Convert dayjs objects to ISO strings for the backend
            const formattedValues = {
                ...values,
                last_contacted: values.last_contacted?.toISOString(),
            };

            let response;
            if (mode === 'edit' && lead?._id) {
                response = await axios.put(`/api/crm/leads/${lead._id}/`, formattedValues);
            } else {
                response = await axios.post('/api/crm/leads/', formattedValues);
            }

            message.success(`Lead successfully ${mode === 'edit' ? 'updated' : 'created'}!`);
            onSave(response.data);
        } catch (error) {
            console.error('Error saving lead:', error);
            message.error('Failed to save lead. Please try again.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                status: 'new',
                source: 'other',
                is_active: true,
                deal_value: 0,
            }}
        >
            {/* Basic Information */}
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the lead name' }]}
            >
                <Input placeholder="Enter lead name" />
            </Form.Item>

            <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter the phone number' }]}
            >
                <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
                <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
                name="company_name"
                label="Company Name"
            >
                <Input placeholder="Enter company name" />
            </Form.Item>

            {/* Lead Source and Status */}
            <Form.Item
                name="source"
                label="Lead Source"
                rules={[{ required: true, message: 'Please select the lead source' }]}
            >
                <Select placeholder="Select lead source">
                    <Option value="website">Website</Option>
                    <Option value="social_media">Social Media</Option>
                    <Option value="email_campaign">Email Campaign</Option>
                    <Option value="referral">Referral</Option>
                    <Option value="ad_campaign">Ad Campaign</Option>
                    <Option value="cold_call">Cold Call</Option>
                    <Option value="other">Other</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the lead status' }]}
            >
                <Select placeholder="Select lead status">
                    <Option value="new">New</Option>
                    <Option value="contacted">Contacted</Option>
                    <Option value="qualified">Qualified</Option>
                    <Option value="proposal_sent">Proposal Sent</Option>
                    <Option value="negotiation">Negotiation</Option>
                    <Option value="won">Won</Option>
                    <Option value="lost">Lost</Option>
                </Select>
            </Form.Item>

            {/* Campaign and Deal Information */}
            <Form.Item
                name="campaign_name"
                label="Campaign Name"
            >
                <Input placeholder="Enter campaign name" />
            </Form.Item>

            <Form.Item
                name="deal_value"
                label="Deal Value"
            >
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Enter deal value"
                />
            </Form.Item>

            {/* Tags */}
            <Form.Item
                name="tags"
                label="Tags"
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Add tags"
                    tokenSeparators={[',']}
                />
            </Form.Item>

            {/* Assignment and Contact Information */}
            <Form.Item
                name="assigned_to"
                label="Assigned To"
            >
                <Input placeholder="Enter assignee name or ID" />
            </Form.Item>

            <Form.Item
                name="last_contacted"
                label="Last Contacted"
            >
                <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder="Select last contact date and time"
                />
            </Form.Item>

            {/* Notes */}
            <Form.Item
                name="notes"
                label="Notes"
            >
                <TextArea
                    rows={4}
                    placeholder="Enter any additional notes about the lead"
                />
            </Form.Item>

            {/* Form Actions */}
            <Form.Item>
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                    >
                        {mode === 'edit' ? 'Update Lead' : 'Create Lead'}
                    </Button>
                    <Button
                        onClick={onCancel}
                        icon={<CloseOutlined />}
                    >
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default LeadForm; 
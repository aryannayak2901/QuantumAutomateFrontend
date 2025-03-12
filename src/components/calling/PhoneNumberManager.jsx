import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Button, 
    Form, 
    Input, 
    Select, 
    message, 
    Spin, 
    Typography, 
    Space, 
    Empty, 
    Tag,
    Divider,
    Alert
} from 'antd';
import { PhoneOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import API from '../../api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PhoneNumberManager = () => {
    const [loading, setLoading] = useState(true);
    const [phoneNumberData, setPhoneNumberData] = useState(null);
    const [requestingNumber, setRequestingNumber] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPhoneNumber();
    }, []);

    const fetchPhoneNumber = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await API.get('api/phone-number/');
            setPhoneNumberData(response.data);
        } catch (err) {
            console.error('Error fetching phone number:', err);
            setError('Failed to fetch phone number information. Please try again later.');
            
            // For development purposes, set mock data if API fails
            if (process.env.NODE_ENV === 'development') {
                console.log('Using mock phone number data in development');
                setPhoneNumberData({
                    has_number: true,
                    phone_number: '+1234567890',
                    friendly_name: 'QuantumAutomate Business',
                    purchase_date: new Date().toISOString(),
                    monthly_rental: 5.99
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNumber = async (values) => {
        try {
            setRequestingNumber(true);
            setError(null);
            
            // API call to request new number
            const response = await API.post('api/phone-number/', values);
            message.success('Successfully acquired new phone number!');
            setPhoneNumberData(response.data);
        } catch (err) {
            console.error('Error requesting phone number:', err);
            setError('Failed to request phone number. Please try again later.');
            message.error('Failed to acquire phone number');
        } finally {
            setRequestingNumber(false);
        }
    };

    const renderPhoneNumberInfo = () => {
        if (!phoneNumberData) return null;

        if (!phoneNumberData.has_number) {
            return (
                <Card className="number-request-card">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No Phone Number Assigned"
                    >
                        <Paragraph>
                            You need a dedicated phone number to make and receive calls with the AI Calling Agent.
                        </Paragraph>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleRequestNumber}
                        >
                            <Form.Item
                                name="country_code"
                                label="Country"
                                initialValue="US"
                                rules={[{ required: true, message: 'Please select a country' }]}
                            >
                                <Select placeholder="Select country">
                                    <Option value="US">United States</Option>
                                    <Option value="IN">India</Option>
                                    <Option value="CA">Canada</Option>
                                    <Option value="GB">United Kingdom</Option>
                                    <Option value="AU">Australia</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />} 
                                    loading={requestingNumber}
                                    htmlType="submit"
                                >
                                    Request Phone Number
                                </Button>
                            </Form.Item>
                        </Form>
                    </Empty>
                </Card>
            );
        }

        return (
            <Card className="phone-number-info-card">
                <Title level={4}>Your Dedicated Phone Number</Title>
                <Divider />
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div className="number-display">
                        <PhoneOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
                        <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{phoneNumberData.phone_number}</Text>
                        <Tag color="green" style={{ marginLeft: '12px' }}>Active</Tag>
                    </div>
                    
                    <div className="number-details">
                        <Paragraph>
                            <Text strong>Friendly Name:</Text> {phoneNumberData.friendly_name}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Purchase Date:</Text> {new Date(phoneNumberData.purchase_date).toLocaleDateString()}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Monthly Rental:</Text> ${phoneNumberData.monthly_rental.toFixed(2)}
                        </Paragraph>
                    </div>
                    
                    <Alert
                        message="Phone Number Usage"
                        description="This phone number is used for all outbound calls made by your AI Calling Agent. Customers will see this number on their caller ID."
                        type="info"
                        showIcon
                        icon={<InfoCircleOutlined />}
                    />
                </Space>
            </Card>
        );
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Loading phone number information...</div>
            </div>
        );
    }

    if (error && !phoneNumberData) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                action={
                    <Button size="small" type="primary" onClick={fetchPhoneNumber}>
                        Retry
                    </Button>
                }
            />
        );
    }

    return (
        <div className="phone-number-manager">
            <Title level={3}>Phone Number Management</Title>
            <Paragraph className="section-description">
                Manage your dedicated phone number for AI calling campaigns.
            </Paragraph>
            
            {renderPhoneNumberInfo()}
        </div>
    );
};

export default PhoneNumberManager;

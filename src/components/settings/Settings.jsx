import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Form,
    Input,
    Button,
    Switch,
    Select,
    message,
    Divider,
    Space,
    Upload
} from 'antd';
import {
    UserOutlined,
    BellOutlined,
    ApiOutlined,
    SecurityScanOutlined,
    UploadOutlined,
    InstagramOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [userForm] = Form.useForm();
    const [notificationForm] = Form.useForm();
    const [integrationForm] = Form.useForm();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/settings/');
            const settings = response.data;
            
            // Set form values
            userForm.setFieldsValue(settings.user);
            notificationForm.setFieldsValue(settings.notifications);
            integrationForm.setFieldsValue(settings.integrations);
        } catch (error) {
            message.error('Failed to fetch settings');
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSettingsSubmit = async (values) => {
        try {
            setLoading(true);
            await axios.put('/api/settings/user/', values);
            message.success('User settings updated successfully');
        } catch (error) {
            message.error('Failed to update user settings');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationSettingsSubmit = async (values) => {
        try {
            setLoading(true);
            await axios.put('/api/settings/notifications/', values);
            message.success('Notification settings updated successfully');
        } catch (error) {
            message.error('Failed to update notification settings');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIntegrationSettingsSubmit = async (values) => {
        try {
            setLoading(true);
            await axios.put('/api/settings/integrations/', values);
            message.success('Integration settings updated successfully');
        } catch (error) {
            message.error('Failed to update integration settings');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Tabs defaultActiveKey="user">
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            User Settings
                        </span>
                    }
                    key="user"
                >
                    <Card title="User Profile Settings">
                        <Form
                            form={userForm}
                            layout="vertical"
                            onFinish={handleUserSettingsSubmit}
                        >
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="timezone"
                                label="Timezone"
                                rules={[{ required: true, message: 'Please select your timezone' }]}
                            >
                                <Select>
                                    <Option value="UTC">UTC</Option>
                                    <Option value="America/New_York">Eastern Time</Option>
                                    <Option value="America/Los_Angeles">Pacific Time</Option>
                                    {/* Add more timezones as needed */}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <ApiOutlined />
                            Exotel Integration
                        </span>
                    }
                    key="exotel"
                >
                    <Card title="Exotel Phone Integration">
                        <Form
                            layout="vertical"
                            onFinish={async (values) => {
                                try {
                                    setLoading(true);
                                    const response = await axios.post('/api/users/exotel/enable/');
                                    message.success('Exotel integration enabled successfully');
                                    // Update the form with the new phone number
                                    integrationForm.setFieldsValue({
                                        exotel_phone_number: response.data.exotel_phone_number
                                    });
                                } catch (error) {
                                    message.error(error.response?.data?.message || 'Failed to enable Exotel');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            <div className="mb-4">
                                <p>Enable Exotel integration to get a dedicated Indian phone number for your business calls.</p>
                                <p>Once enabled, you'll receive a phone number that will be used for all your outbound and inbound calls.</p>
                            </div>
                            
                            <Form.Item
                                name="exotel_phone_number"
                                label="Your Exotel Phone Number"
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading}
                                        disabled={integrationForm.getFieldValue('exotel_phone_number')}
                                    >
                                        Enable Exotel
                                    </Button>
                                    {integrationForm.getFieldValue('exotel_phone_number') && (
                                        <Button 
                                            danger 
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);
                                                    await axios.post('/api/users/exotel/disable/');
                                                    message.success('Exotel integration disabled successfully');
                                                    integrationForm.setFieldsValue({
                                                        exotel_phone_number: null
                                                    });
                                                } catch (error) {
                                                    message.error(error.response?.data?.message || 'Failed to disable Exotel');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            loading={loading}
                                        >
                                            Disable Exotel
                                        </Button>
                                    )}
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <BellOutlined />
                            Notifications
                        </span>
                    }
                    key="notifications"
                >
                    <Card title="Notification Preferences">
                        <Form
                            form={notificationForm}
                            layout="vertical"
                            onFinish={handleNotificationSettingsSubmit}
                        >
                            <Form.Item
                                name="email_notifications"
                                label="Email Notifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                name="lead_notifications"
                                label="New Lead Notifications"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                name="call_notifications"
                                label="Call Reminders"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                name="campaign_updates"
                                label="Campaign Updates"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Save Preferences
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <ApiOutlined />
                            Integrations
                        </span>
                    }
                    key="integrations"
                >
                    <Card title="API Integrations">
                        <Form
                            form={integrationForm}
                            layout="vertical"
                            onFinish={handleIntegrationSettingsSubmit}
                        >
                            <div className="mb-6">
                                <h3 className="text-lg mb-4">Instagram Integration</h3>
                                <Space direction="vertical" className="w-full">
                                    <Button icon={<InstagramOutlined />} type="primary">
                                        Connect Instagram Account
                                    </Button>
                                    <Form.Item
                                        name="instagram_webhook_url"
                                        label="Webhook URL"
                                    >
                                        <Input.TextArea rows={2} />
                                    </Form.Item>
                                </Space>
                            </div>

                            <Divider />

                            <div className="mb-6">
                                <h3 className="text-lg mb-4">AI Voice Settings</h3>
                                <Form.Item
                                    name="voice_model"
                                    label="Voice Model"
                                >
                                    <Select>
                                        <Option value="neural">Neural Voice</Option>
                                        <Option value="standard">Standard Voice</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="voice_language"
                                    label="Voice Language"
                                >
                                    <Select>
                                        <Option value="en-US">English (US)</Option>
                                        <Option value="en-GB">English (UK)</Option>
                                        <Option value="es">Spanish</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <Divider />

                            <div className="mb-6">
                                <h3 className="text-lg mb-4">API Keys</h3>
                                <Form.Item
                                    name="openai_api_key"
                                    label="OpenAI API Key"
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name="twilio_account_sid"
                                    label="Twilio Account SID"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="twilio_auth_token"
                                    label="Twilio Auth Token"
                                >
                                    <Input.Password />
                                </Form.Item>
                            </div>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Save Integration Settings
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <SecurityScanOutlined />
                            Security
                        </span>
                    }
                    key="security"
                >
                    <Card title="Security Settings">
                        <Form layout="vertical">
                            <Form.Item
                                name="current_password"
                                label="Current Password"
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="new_password"
                                label="New Password"
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirm_password"
                                label="Confirm New Password"
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">
                                    Change Password
                                </Button>
                            </Form.Item>

                            <Divider />

                            <Form.Item
                                name="two_factor"
                                label="Two-Factor Authentication"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Settings;
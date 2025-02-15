import React, { useState } from "react";
import { Tabs, Card, Form, Input, Button, Switch, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import "./Settings.css";

const { TabPane } = Tabs;
const { Option } = Select;

const Settings = () => {
    const [profileForm] = Form.useForm();
    const [preferencesForm] = Form.useForm();
    const [notificationsForm] = Form.useForm();
    const [apiKey, setApiKey] = useState("sk_test_1234567890abcdef"); // Example API key

    // Handle profile update
    const handleProfileUpdate = (values) => {
        message.success("Profile updated successfully!");
        console.log("Updated Profile:", values);
    };

    // Handle preferences update
    const handlePreferencesUpdate = (values) => {
        message.success("Preferences updated successfully!");
        console.log("Updated Preferences:", values);
    };

    // Handle notifications update
    const handleNotificationsUpdate = (values) => {
        message.success("Notification settings updated successfully!");
        console.log("Updated Notifications:", values);
    };

    // Handle API key regeneration
    const regenerateApiKey = () => {
        const newKey = `sk_test_${Math.random().toString(36).substring(2, 18)}`;
        setApiKey(newKey);
        message.success("API key regenerated successfully!");
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Settings</h2>
            <Tabs defaultActiveKey="1" type="card">
                {/* Profile Settings */}
                <TabPane tab="Profile" key="1">
                    <Card title="Profile Settings" bordered={false}>
                        <Form form={profileForm} layout="vertical" onFinish={handleProfileUpdate}>
                            <Form.Item
                                name="profilePicture"
                                label="Profile Picture"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e.fileList}
                            >
                                <Upload beforeUpload={() => false} listType="picture">
                                    <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: "Please enter your name!" }]}
                            >
                                <Input placeholder="Enter your full name" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: "Please enter your phone number!" }]}
                            >
                                <Input placeholder="Enter your phone number" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* Preferences */}
                <TabPane tab="Preferences" key="2">
                    <Card title="Preferences" bordered={false}>
                        <Form form={preferencesForm} layout="vertical" onFinish={handlePreferencesUpdate}>
                            <Form.Item name="theme" label="Theme" initialValue="light">
                                <Select>
                                    <Option value="light">Light</Option>
                                    <Option value="dark">Dark</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="language" label="Language" initialValue="en">
                                <Select>
                                    <Option value="en">English</Option>
                                    <Option value="es">Spanish</Option>
                                    <Option value="fr">French</Option>
                                    <Option value="de">German</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save Preferences
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* Notifications */}
                <TabPane tab="Notifications" key="3">
                    <Card title="Notification Settings" bordered={false}>
                        <Form form={notificationsForm} layout="vertical" onFinish={handleNotificationsUpdate}>
                            <Form.Item name="emailNotifications" label="Email Notifications" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="smsNotifications" label="SMS Notifications" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="pushNotifications" label="Push Notifications" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save Notification Settings
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* System Configuration */}
                <TabPane tab="System Configuration" key="4">
                    <Card title="System Configuration" bordered={false}>
                        <Form layout="vertical">
                            <Form.Item label="API Key">
                                <Input.Group compact>
                                    <Input value={apiKey} readOnly style={{ width: "calc(100% - 120px)" }} />
                                    <Button type="primary" onClick={regenerateApiKey}>
                                        Regenerate
                                    </Button>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item label="Integrations">
                                <Select placeholder="Select Integration" mode="multiple" allowClear>
                                    <Option value="twilio">Twilio</Option>
                                    <Option value="instagram">Instagram</Option>
                                    <Option value="facebook">Facebook</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Save Configuration</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Settings;

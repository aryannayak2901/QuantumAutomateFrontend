import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Typography,
    Table,
    Space,
    Modal,
    Form,
    Input,
    Select,
    message,
    Tabs,
    Tooltip,
    Tag,
    Popconfirm,
    Drawer,
    Divider,
    Row,
    Col,
    Alert
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    PhoneOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import AICallingService from '../../services/aiCallingService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const industryTemplates = {
    "real_estate": {
        name: "Real Estate Appointment Scheduler",
        greeting: "Hello, I'm calling on behalf of [AGENT_NAME] from [COMPANY]. I'm following up about your interest in properties in the [AREA] area. Is this a good time to talk?",
        purpose: "I'd like to discuss your property requirements and potentially schedule a viewing appointment.",
        questions: [
            "What type of property are you looking for?",
            "How many bedrooms do you need?",
            "What's your budget range?",
            "Are there specific neighborhoods you're interested in?",
            "When would be a good time for you to view properties?"
        ],
        closing: "Great! I've scheduled your viewing appointment for [DATE] at [TIME]. You'll receive a confirmation email shortly. Looking forward to helping you find your dream home."
    },
    "healthcare": {
        name: "Healthcare Appointment Reminder",
        greeting: "Hello, I'm calling from [CLINIC_NAME] regarding your upcoming appointment. Is this [PATIENT_NAME]?",
        purpose: "I'm calling to confirm your appointment with Dr. [DOCTOR_NAME] on [DATE] at [TIME].",
        questions: [
            "Will you be able to make this appointment?",
            "Do you need any special accommodations for your visit?",
            "Do you have any questions about preparing for this appointment?",
            "Would you like me to send you a reminder email with pre-appointment instructions?"
        ],
        closing: "Perfect! Your appointment is confirmed for [DATE] at [TIME]. Please arrive 15 minutes early to complete any necessary paperwork. We look forward to seeing you then."
    },
    "sales": {
        name: "Product Demo Scheduler",
        greeting: "Hello, this is [NAME] from [COMPANY]. I understand you recently showed interest in our [PRODUCT]. Do you have a moment to talk?",
        purpose: "I'd like to understand your needs better and possibly arrange a personalized product demonstration.",
        questions: [
            "What challenges are you currently facing that led you to look at our solution?",
            "How many people in your organization would be using this product?",
            "Have you tried similar products before?",
            "What's your timeline for implementing a solution?",
            "Would you be interested in a personalized demonstration of how our product can address your specific needs?"
        ],
        closing: "Excellent! I've scheduled a product demonstration for [DATE] at [TIME]. You'll receive a calendar invitation with the meeting details. I'm looking forward to showing you how our solution can help your business grow."
    },
    "customer_service": {
        name: "Customer Feedback Collector",
        greeting: "Hello, I'm calling from [COMPANY] customer success team. I'm reaching out to valued customers like you to collect feedback. Do you have a few minutes to share your thoughts?",
        purpose: "We're always looking to improve our service, and your feedback is incredibly valuable to us.",
        questions: [
            "On a scale of 1-10, how satisfied are you with our product/service?",
            "What do you like most about working with us?",
            "Is there anything we could improve about our product or service?",
            "How responsive has our support team been to your needs?",
            "Would you recommend our product/service to others in your industry?"
        ],
        closing: "Thank you so much for your valuable feedback. We'll use this information to improve our offerings. As a token of our appreciation, we'll be sending you a small gift card. Is your email [EMAIL] still correct for us to send it to?"
    },
    "custom": {
        name: "Custom Script",
        greeting: "Hello, this is [NAME] from [COMPANY].",
        purpose: "I'm calling about [PURPOSE].",
        questions: ["[ADD_YOUR_QUESTIONS_HERE]"],
        closing: "Thank you for your time. [CLOSING_MESSAGE]"
    }
};

const CallScriptManager = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingScript, setEditingScript] = useState(null);
    const [previewScript, setPreviewScript] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState('custom');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchScripts();
    }, []);

    const fetchScripts = async () => {
        try {
            setLoading(true);
            const scriptsData = await AICallingService.getCallScripts();
            setScripts(scriptsData);
        } catch (error) {
            console.error('Error fetching scripts:', error);
            message.error('Failed to load call scripts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateScript = async (values) => {
        try {
            const formData = {
                ...values,
                questions: values.questions.split('\\n').filter(q => q.trim() !== '')
            };

            if (editingScript) {
                await AICallingService.updateCallScript(editingScript.id, formData);
                message.success('Script updated successfully');
            } else {
                await AICallingService.saveCallScript(formData);
                message.success('Script created successfully');
            }

            setModalVisible(false);
            form.resetFields();
            setEditingScript(null);
            fetchScripts();
        } catch (error) {
            console.error('Error saving script:', error);
            message.error('Failed to save call script');
        }
    };

    const handleDeleteScript = async (scriptId) => {
        try {
            await AICallingService.deleteCallScript(scriptId);
            message.success('Script deleted successfully');
            fetchScripts();
        } catch (error) {
            console.error('Error deleting script:', error);
            message.error('Failed to delete call script');
        }
    };

    const handleDuplicateScript = async (script) => {
        try {
            const duplicateData = {
                ...script,
                name: `${script.name} (Copy)`,
                id: undefined
            };
            await AICallingService.saveCallScript(duplicateData);
            message.success('Script duplicated successfully');
            fetchScripts();
        } catch (error) {
            console.error('Error duplicating script:', error);
            message.error('Failed to duplicate call script');
        }
    };

    const showCreateModal = () => {
        form.resetFields();
        setEditingScript(null);
        setSelectedIndustry('custom');
        setModalVisible(true);
    };

    const showEditModal = (script) => {
        setEditingScript(script);
        form.setFieldsValue({
            ...script,
            questions: script.questions.join('\\n')
        });
        setModalVisible(true);
    };

    const showPreviewDrawer = (script) => {
        setPreviewScript(script);
        setDrawerVisible(true);
    };

    const handleIndustryTemplateChange = (industry) => {
        setSelectedIndustry(industry);
        const template = industryTemplates[industry];
        
        form.setFieldsValue({
            name: template.name,
            greeting: template.greeting,
            purpose: template.purpose,
            questions: template.questions.join('\\n'),
            closing: template.closing
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Industry',
            dataIndex: 'industry',
            key: 'industry',
            render: (industry) => (
                <Tag color={
                    industry === 'real_estate' ? 'blue' : 
                    industry === 'healthcare' ? 'green' :
                    industry === 'sales' ? 'orange' :
                    industry === 'customer_service' ? 'purple' : 'default'
                }>
                    {industry?.replace('_', ' ').toUpperCase() || 'CUSTOM'}
                </Tag>
            )
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Preview Script">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => showPreviewDrawer(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Edit Script">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => showEditModal(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Duplicate Script">
                        <Button 
                            icon={<CopyOutlined />} 
                            onClick={() => handleDuplicateScript(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Delete Script">
                        <Popconfirm
                            title="Are you sure you want to delete this script?"
                            onConfirm={() => handleDeleteScript(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button 
                                icon={<DeleteOutlined />} 
                                danger
                                type="text"
                            />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Make Call with Script">
                        <Button 
                            icon={<PhoneOutlined />} 
                            type="primary"
                            size="small"
                            onClick={() => {
                                message.info(`Navigate to dialer with script ${record.id} selected`);
                                // Implementation will connect to the dialer component
                            }}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="call-script-manager">
            <div className="section-header">
                <Title level={3}>Call Script Management</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={showCreateModal}
                >
                    Create New Script
                </Button>
            </div>

            <Alert
                message="AI Call Scripts"
                description="Create and manage AI call scripts that your AI Calling Agent will use when making calls. Choose from industry templates or create your own custom scripts."
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
                icon={<InfoCircleOutlined />}
            />
            
            <Card>
                <Table
                    columns={columns}
                    dataSource={scripts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Create/Edit Script Modal */}
            <Modal
                title={editingScript ? 'Edit Call Script' : 'Create New Call Script'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateOrUpdateScript}
                    initialValues={{
                        industry: 'custom',
                        name: '',
                        greeting: '',
                        purpose: '',
                        questions: '',
                        closing: ''
                    }}
                >
                    {!editingScript && (
                        <Form.Item
                            label="Start with Industry Template"
                            name="template"
                        >
                            <Select 
                                placeholder="Select an industry template" 
                                onChange={handleIndustryTemplateChange}
                                value={selectedIndustry}
                            >
                                <Option value="real_estate">Real Estate</Option>
                                <Option value="healthcare">Healthcare</Option>
                                <Option value="sales">Sales</Option>
                                <Option value="customer_service">Customer Service</Option>
                                <Option value="custom">Custom Script</Option>
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Script Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter a script name' }]}
                    >
                        <Input placeholder="E.g., Property Viewing Scheduler" />
                    </Form.Item>

                    <Form.Item
                        label="Industry"
                        name="industry"
                        rules={[{ required: true, message: 'Please select an industry' }]}
                    >
                        <Select placeholder="Select an industry">
                            <Option value="real_estate">Real Estate</Option>
                            <Option value="healthcare">Healthcare</Option>
                            <Option value="sales">Sales</Option>
                            <Option value="customer_service">Customer Service</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Greeting" key="1">
                            <Form.Item
                                label="Greeting Script"
                                name="greeting"
                                rules={[{ required: true, message: 'Please enter a greeting' }]}
                            >
                                <TextArea 
                                    rows={5} 
                                    placeholder="Hello, I'm calling from [COMPANY_NAME]..."
                                />
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="Purpose" key="2">
                            <Form.Item
                                label="Call Purpose"
                                name="purpose"
                                rules={[{ required: true, message: 'Please enter the call purpose' }]}
                            >
                                <TextArea 
                                    rows={4} 
                                    placeholder="I'm calling to discuss..."
                                />
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="Questions" key="3">
                            <Form.Item
                                label="Questions (one per line)"
                                name="questions"
                                rules={[{ required: true, message: 'Please enter at least one question' }]}
                            >
                                <TextArea 
                                    rows={8} 
                                    placeholder="What are your property requirements?
How many bedrooms are you looking for?
What is your budget range?"
                                />
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="Closing" key="4">
                            <Form.Item
                                label="Closing Script"
                                name="closing"
                                rules={[{ required: true, message: 'Please enter a closing' }]}
                            >
                                <TextArea 
                                    rows={5} 
                                    placeholder="Thank you for your time. I've scheduled your appointment for..."
                                />
                            </Form.Item>
                        </TabPane>
                    </Tabs>

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingScript ? 'Update Script' : 'Create Script'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* Script Preview Drawer */}
            <Drawer
                title={`Script Preview: ${previewScript?.name || ''}`}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={600}
            >
                {previewScript && (
                    <div className="script-preview">
                        <div className="script-section">
                            <Title level={4}>Greeting</Title>
                            <Paragraph>{previewScript.greeting}</Paragraph>
                        </div>
                        
                        <Divider />
                        
                        <div className="script-section">
                            <Title level={4}>Purpose</Title>
                            <Paragraph>{previewScript.purpose}</Paragraph>
                        </div>
                        
                        <Divider />
                        
                        <div className="script-section">
                            <Title level={4}>Questions</Title>
                            <ul>
                                {previewScript.questions.map((question, index) => (
                                    <li key={index}><Paragraph>{question}</Paragraph></li>
                                ))}
                            </ul>
                        </div>
                        
                        <Divider />
                        
                        <div className="script-section">
                            <Title level={4}>Closing</Title>
                            <Paragraph>{previewScript.closing}</Paragraph>
                        </div>

                        <Divider />
                        
                        <div className="script-actions">
                            <Space>
                                <Button 
                                    type="primary" 
                                    icon={<PhoneOutlined />}
                                    onClick={() => {
                                        message.info(`Navigate to dialer with script ${previewScript.id} selected`);
                                        // Implementation will connect to the dialer component
                                    }}
                                >
                                    Use This Script
                                </Button>
                                <Button 
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setDrawerVisible(false);
                                        showEditModal(previewScript);
                                    }}
                                >
                                    Edit Script
                                </Button>
                            </Space>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default CallScriptManager;

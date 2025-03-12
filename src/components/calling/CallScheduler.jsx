import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    TimePicker,
    Typography,
    Table,
    Space,
    Tag,
    Modal,
    message,
    Tooltip,
    Popconfirm,
    Alert,
    Empty,
    Upload,
    Switch,
    Tabs,
    Spin,
    Collapse,
    Divider,
    Row,
    Col
} from 'antd';
import {
    ScheduleOutlined,
    PhoneOutlined,
    DeleteOutlined,
    EditOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    UploadOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import Papa from 'react-papaparse';
import dayjs from 'dayjs';
import AICallingService from '../../services/aiCallingService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const CallScheduler = () => {
    const [scheduledCalls, setScheduledCalls] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [bulkModalVisible, setBulkModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [bulkContacts, setBulkContacts] = useState([]);
    const [form] = Form.useForm();
    const [bulkForm] = Form.useForm();
    const [tabActive, setTabActive] = useState('1');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch scripts for dropdown
            const scriptsData = await AICallingService.getCallScripts();
            setScripts(scriptsData);
            
            // Fetch scheduled calls
            // Note: This endpoint needs to be implemented in the backend
            try {
                const scheduledData = await AICallingService.getScheduledCalls();
                setScheduledCalls(scheduledData);
            } catch (error) {
                console.warn('Error fetching scheduled calls, using mock data:', error);
                // Mock data for development
                setScheduledCalls([
                    {
                        id: '1',
                        phone_number: '+15551234567',
                        contact_name: 'John Smith',
                        script_id: scriptsData[0]?.id || '1',
                        script_name: scriptsData[0]?.name || 'Real Estate Script',
                        scheduled_time: new Date().toISOString(),
                        status: 'scheduled',
                        notes: 'Interested in 3-bedroom properties'
                    },
                    {
                        id: '2',
                        phone_number: '+15559876543',
                        contact_name: 'Jane Doe',
                        script_id: scriptsData[1]?.id || '2',
                        script_name: scriptsData[1]?.name || 'Sales Follow-up',
                        scheduled_time: new Date(Date.now() + 86400000).toISOString(),
                        status: 'scheduled',
                        notes: 'Follow up on product demo'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            message.error('Failed to load call data');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleCall = async (values) => {
        try {
            const scheduleData = {
                ...values,
                scheduled_time: values.scheduled_datetime.toISOString(),
                script_id: values.script_id,
                status: 'scheduled'
            };
            
            if (editingSchedule) {
                await AICallingService.updateScheduledCall(editingSchedule.id, scheduleData);
                message.success('Call schedule updated successfully');
            } else {
                await AICallingService.scheduleCall(scheduleData);
                message.success('Call scheduled successfully');
            }
            
            setModalVisible(false);
            form.resetFields();
            setEditingSchedule(null);
            fetchData();
        } catch (error) {
            console.error('Error scheduling call:', error);
            message.error('Failed to schedule call');
        }
    };

    const handleBulkSchedule = async (values) => {
        if (bulkContacts.length === 0) {
            message.warning('Please upload contacts first');
            return;
        }
        
        try {
            const scheduleTime = values.schedule_time;
            const scriptId = values.script_id;
            
            // Process bulk scheduling
            const scheduleBatch = bulkContacts.map(contact => ({
                phone_number: contact.phone_number,
                contact_name: contact.name,
                scheduled_time: scheduleTime.toISOString(),
                script_id: scriptId,
                notes: values.notes || '',
                status: 'scheduled'
            }));
            
            await AICallingService.bulkScheduleCalls(scheduleBatch);
            message.success(`Successfully scheduled ${bulkContacts.length} calls`);
            
            setBulkModalVisible(false);
            bulkForm.resetFields();
            setBulkContacts([]);
            fetchData();
        } catch (error) {
            console.error('Error in bulk scheduling:', error);
            message.error('Failed to schedule bulk calls');
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await AICallingService.deleteScheduledCall(scheduleId);
            message.success('Call schedule deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            message.error('Failed to delete call schedule');
        }
    };

    const handleToggleStatus = async (record, newStatus) => {
        try {
            await AICallingService.updateScheduledCall(record.id, {
                ...record,
                status: newStatus
            });
            message.success(`Call ${newStatus === 'paused' ? 'paused' : 'scheduled'} successfully`);
            fetchData();
        } catch (error) {
            console.error('Error updating call status:', error);
            message.error('Failed to update call status');
        }
    };

    const handleCSVUpload = (data) => {
        const validContacts = data
            .filter(row => row.data && row.data.phone_number && row.data.name)
            .map(row => ({
                phone_number: row.data.phone_number,
                name: row.data.name,
                notes: row.data.notes || ''
            }));
            
        setBulkContacts(validContacts);
        message.success(`Loaded ${validContacts.length} contacts`);
    };

    const showScheduleModal = () => {
        form.resetFields();
        setEditingSchedule(null);
        setModalVisible(true);
    };

    const showEditModal = (schedule) => {
        setEditingSchedule(schedule);
        form.setFieldsValue({
            phone_number: schedule.phone_number,
            contact_name: schedule.contact_name,
            script_id: schedule.script_id,
            scheduled_datetime: dayjs(schedule.scheduled_time),
            notes: schedule.notes
        });
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Contact Name',
            dataIndex: 'contact_name',
            key: 'contact_name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Script',
            dataIndex: 'script_name',
            key: 'script_name',
        },
        {
            title: 'Scheduled Time',
            dataIndex: 'scheduled_time',
            key: 'scheduled_time',
            render: (text) => new Date(text).toLocaleString()
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={
                    status === 'scheduled' ? 'green' : 
                    status === 'completed' ? 'blue' :
                    status === 'paused' ? 'orange' :
                    status === 'failed' ? 'red' : 'default'
                }>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'scheduled' && (
                        <Tooltip title="Pause Call">
                            <Button
                                icon={<PauseCircleOutlined />}
                                onClick={() => handleToggleStatus(record, 'paused')}
                                type="text"
                            />
                        </Tooltip>
                    )}
                    {record.status === 'paused' && (
                        <Tooltip title="Resume Call">
                            <Button
                                icon={<PlayCircleOutlined />}
                                onClick={() => handleToggleStatus(record, 'scheduled')}
                                type="text"
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Edit Schedule">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => showEditModal(record)}
                            type="text"
                            disabled={record.status === 'completed' || record.status === 'failed'}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Schedule">
                        <Popconfirm
                            title="Are you sure you want to delete this scheduled call?"
                            onConfirm={() => handleDeleteSchedule(record.id)}
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
                </Space>
            )
        }
    ];

    return (
        <div className="call-scheduler">
            <div className="section-header">
                <Title level={3}>Call Scheduler</Title>
                <Space>
                    <Button 
                        type="primary" 
                        icon={<ScheduleOutlined />} 
                        onClick={showScheduleModal}
                    >
                        Schedule New Call
                    </Button>
                    <Button 
                        icon={<UploadOutlined />} 
                        onClick={() => setBulkModalVisible(true)}
                    >
                        Bulk Schedule
                    </Button>
                </Space>
            </div>

            <Alert
                message="AI Call Scheduling"
                description="Schedule AI calls to be made automatically at specific times. You can schedule individual calls or upload a CSV for bulk scheduling."
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
                icon={<InfoCircleOutlined />}
            />

            <Tabs activeKey={tabActive} onChange={setTabActive}>
                <TabPane tab="All Scheduled Calls" key="1">
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={scheduledCalls}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>
                <TabPane tab="Call Calendar" key="2">
                    <Card>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div className="call-calendar">
                                <p>Calendar view of scheduled calls will be implemented here</p>
                                <Empty description="Calendar view is under development" />
                            </div>
                        )}
                    </Card>
                </TabPane>
            </Tabs>

            {/* Schedule Call Modal */}
            <Modal
                title={editingSchedule ? 'Edit Scheduled Call' : 'Schedule New Call'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleScheduleCall}
                >
                    <Form.Item
                        label="Phone Number"
                        name="phone_number"
                        rules={[
                            { required: true, message: 'Please enter phone number' },
                            { pattern: /^\+?[1-9]\d{9,14}$/, message: 'Please enter a valid phone number' }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="+1234567890" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Name"
                        name="contact_name"
                        rules={[{ required: true, message: 'Please enter contact name' }]}
                    >
                        <Input placeholder="John Smith" />
                    </Form.Item>

                    <Form.Item
                        label="Call Script"
                        name="script_id"
                        rules={[{ required: true, message: 'Please select a call script' }]}
                    >
                        <Select placeholder="Select a script">
                            {scripts.map(script => (
                                <Option key={script.id} value={script.id}>{script.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Scheduled Date & Time"
                        name="scheduled_datetime"
                        rules={[{ required: true, message: 'Please select date and time' }]}
                    >
                        <DatePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm" 
                            style={{ width: '100%' }}
                            disabledDate={current => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input.TextArea rows={4} placeholder="Add any notes about this call..." />
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingSchedule ? 'Update Schedule' : 'Schedule Call'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* Bulk Schedule Modal */}
            <Modal
                title="Bulk Schedule Calls"
                open={bulkModalVisible}
                onCancel={() => {
                    setBulkModalVisible(false);
                    setBulkContacts([]);
                }}
                footer={null}
                width={700}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Upload Contacts" key="1">
                        <Alert
                            message="CSV Format"
                            description="Your CSV file should have columns: name, phone_number, notes (optional)"
                            type="info"
                            showIcon
                            style={{ marginBottom: '20px' }}
                        />

                        <div className="csv-upload-container" style={{ marginBottom: '20px' }}>
                            <Papa.CSVReader
                                onDrop={handleCSVUpload}
                                onError={(err) => message.error(`Error reading CSV: ${err}`)}
                                addRemoveButton
                                removeButtonColor="#659cef"
                                config={{
                                    header: true,
                                    delimiter: ','
                                }}
                            >
                                <span>Drop CSV file here or click to upload.</span>
                            </Papa.CSVReader>
                        </div>

                        {bulkContacts.length > 0 && (
                            <div className="contacts-preview">
                                <div style={{ marginBottom: '10px' }}>
                                    <Text strong>Loaded {bulkContacts.length} contacts</Text>
                                </div>
                                <Table
                                    dataSource={bulkContacts.slice(0, 5)}
                                    columns={[
                                        { title: 'Name', dataIndex: 'name', key: 'name' },
                                        { title: 'Phone', dataIndex: 'phone_number', key: 'phone' },
                                        { title: 'Notes', dataIndex: 'notes', key: 'notes' }
                                    ]}
                                    size="small"
                                    pagination={false}
                                    footer={() => bulkContacts.length > 5 ? `${bulkContacts.length - 5} more contacts not shown` : null}
                                />
                            </div>
                        )}
                    </TabPane>
                </Tabs>

                <Divider />

                <Form
                    form={bulkForm}
                    layout="vertical"
                    onFinish={handleBulkSchedule}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Call Script"
                                name="script_id"
                                rules={[{ required: true, message: 'Please select a call script' }]}
                            >
                                <Select placeholder="Select a script">
                                    {scripts.map(script => (
                                        <Option key={script.id} value={script.id}>{script.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Schedule Time"
                                name="schedule_time"
                                rules={[{ required: true, message: 'Please select date and time' }]}
                            >
                                <DatePicker 
                                    showTime 
                                    format="YYYY-MM-DD HH:mm" 
                                    style={{ width: '100%' }}
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Additional Notes (applied to all calls)"
                        name="notes"
                    >
                        <Input.TextArea rows={2} placeholder="Optional notes for all calls..." />
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Space>
                            <Button onClick={() => {
                                setBulkModalVisible(false);
                                setBulkContacts([]);
                            }}>
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                disabled={bulkContacts.length === 0}
                            >
                                Schedule {bulkContacts.length} Calls
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CallScheduler;

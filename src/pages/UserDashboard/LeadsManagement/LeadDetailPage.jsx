import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Tabs, 
  Descriptions, 
  Tag, 
  Timeline, 
  Input, 
  Modal, 
  Form, 
  Select, 
  message, 
  Typography, 
  Divider, 
  Space,
  Spin,
  Empty,
  Avatar,
  Tooltip,
  Badge,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  InstagramOutlined,
  FacebookOutlined,
  MessageOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  TagOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { SetAppointmentModal, EditAppointmentModal } from '../../../components';
import ActivityTimeline from '../../../components/ActivityTimeline/ActivityTimeline';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

// Helper function to ensure a value is an array
const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'blue';
    case 'contacted':
      return 'orange';
    case 'qualified':
      return 'green';
    case 'proposal_sent':
      return 'purple';
    case 'negotiation':
      return 'geekblue';
    case 'won':
      return 'success';
    case 'lost':
      return 'error';
    default:
      return 'default';
  }
};

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  const [newNote, setNewNote] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isSetAppointmentModalVisible, setIsSetAppointmentModalVisible] = useState(false);
  const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);

  useEffect(() => {
    fetchLeadData();
    fetchLeadActivities();
  }, [id]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/leads/${id}/`);
      setLead(response.data);
    } catch (error) {
      setError('Failed to fetch lead data. Please try again later.');
      message.error('Failed to fetch lead data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await axios.get(`/api/leads/${id}/activities/`);
      setActivities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Failed to fetch lead activities. Please try again later.');
      message.error('Failed to fetch lead activities. Please try again later.');
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleLoadMoreActivities = () => {
    if (!hasMoreActivities || activitiesLoading) return;
    fetchLeadActivities(activitiesPage + 1);
  };

  const handleEditLead = (values) => {
    setLoading(true);
    
    axios
      .put(`http://localhost:8000/api/leads/${id}`, values)
      .then(() => {
        message.success('Lead updated successfully!');
        fetchLeadData();
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.error('Error updating lead:', error);
        message.error('Failed to update lead!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      message.warning('Please enter a note.');
      return;
    }
    
    const updatedNotes = [
      ...(lead.notes || []),
      newNote.trim()
    ];
    
    try {
      // Update in backend
      await axios.put(`http://localhost:8000/api/leads/${id}`, {
        ...lead,
        notes: updatedNotes
      });
      
      // Update in state
      setLead({
        ...lead,
        notes: updatedNotes
      });
      
      // Clear the input
      setNewNote('');
      
      // Show success message
      message.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      message.error('Failed to add note.');
    }
  };

  const handleDeleteNote = async (index) => {
    if (index < 0 || index >= (lead.notes || []).length) {
      message.warning('Note not found.');
      return;
    }
    
    const updatedNotes = [...(lead.notes || [])];
    updatedNotes.splice(index, 1);
    
    try {
      // Update in backend
      await axios.put(`http://localhost:8000/api/leads/${id}`, {
        ...lead,
        notes: updatedNotes
      });
      
      // Update in state
      setLead({
        ...lead,
        notes: updatedNotes
      });
      
      // Show success message
      message.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      message.error('Failed to delete note.');
    }
  };

  const handleDeleteLead = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lead?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true);
        
        axios
          .delete(`http://localhost:8000/api/leads/${id}`)
          .then(() => {
            message.success('Lead deleted successfully!');
            navigate('/dashboard/leads');
          })
          .catch((error) => {
            console.error('Error deleting lead:', error);
            message.error('Failed to delete lead!');
            setLoading(false);
          });
      }
    });
  };

  // Save a new appointment
  const handleSetAppointment = async (appointmentData) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/Appointments`, {
        leadId: id,
        ...appointmentData,
      });
      
      setLead({
        ...lead,
        appointment: response.data
      });
      
      setIsSetAppointmentModalVisible(false);
      message.success('Appointment set successfully!');
    } catch (error) {
      console.error('Error setting appointment:', error);
      message.error('Failed to set appointment.');
    }
  };

  // Update an existing appointment
  const handleEditAppointment = async (updatedAppointment) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/Appointments/${lead.appointment.id}`,
        updatedAppointment
      );
      
      setLead({
        ...lead,
        appointment: response.data
      });
      
      setIsEditAppointmentModalVisible(false);
      message.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      message.error('Failed to update appointment.');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      message.warning('Please enter a message.');
      return;
    }
    
    setSendingMessage(true);
    
    try {
      // Determine which channel to use (Instagram, Facebook, SMS, etc.)
      const channel = lead.source === 'Instagram' ? 'instagram' : 
                     lead.source === 'Facebook' ? 'facebook' : 'sms';
      
      // Create message object
      const newMessage = {
        leadId: id,
        text: messageText.trim(),
        timestamp: new Date().toISOString(),
        sender: 'business',
        channel
      };
      
      // Send to API
      const response = await axios.post('http://localhost:8000/api/Messages', newMessage);
      
      // Check if Conversations exist for this lead
      let conversationId;
      
      if (conversations.length === 0) {
        // Create a new conversation if none exists
        const conversationResponse = await axios.post('http://localhost:8000/api/Conversations', {
          leadId: id,
          messages: [response.data],
          channel,
          lastUpdated: new Date().toISOString()
        });
        
        conversationId = conversationResponse.data.id;
        setConversations([conversationResponse.data]);
      } else {
        // Update existing conversation
        const conversation = conversations[0];
        conversationId = conversation.id;
        
        const updatedMessages = [...(conversation.messages || []), response.data];
        
        await axios.put(`http://localhost:8000/api/Conversations/${conversationId}`, {
          ...conversation,
          messages: updatedMessages,
          lastUpdated: new Date().toISOString()
        });
        
        // Update conversations in state
        setConversations([
          {
            ...conversation,
            messages: updatedMessages,
            lastUpdated: new Date().toISOString()
          },
          ...conversations.slice(1)
        ]);
      }
      
      // Clear message input
      setMessageText('');
      message.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      message.warning('Please enter a task.');
      return;
    }
    
    const newTaskItem = {
      id: `task-${Date.now()}`,
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTaskItem];
    
    try {
      // Update the lead with the new task
      await axios.put(`http://localhost:8000/api/leads/${id}`, {
        ...lead,
        tasks: updatedTasks
      });
      
      // Update local state
      setTasks(updatedTasks);
      setNewTask('');
      message.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task.');
    }
  };

  const handleToggleTaskComplete = async (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    try {
      // Update the lead with the updated tasks
      await axios.put(`http://localhost:8000/api/leads/${id}`, {
        ...lead,
        tasks: updatedTasks
      });
      
      // Update local state
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Failed to update task.');
    }
  };

  const handleCallLead = async () => {
    try {
      message.info('Initiating call...');
      // This would typically connect to a calling API
      // For now, just show a message
      setTimeout(() => {
        message.success(`Calling ${lead.name} at ${lead.phone}`);
      }, 1000);
    } catch (error) {
      console.error('Error initiating call:', error);
      message.error('Failed to initiate call.');
    }
  };

  // Render loading state
  if (loading && !lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  // Render error state
  if (error && !lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <Empty
          description={error || 'Lead not found'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/dashboard/Leads')}>
            Back to leads
          </Button>
        </Empty>
      </div>
    );
  }

  // Render content once lead is loaded
  return (
    <div className="lead-detail-page p-6">
      {error && <Alert message={error} type="error" showIcon />}
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/dashboard/Leads')}
              >
                Back to Leads
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                {lead.name}
              </Title>
              <Tag color={getStatusColor(lead.status)}>{lead.status}</Tag>
            </Space>
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setEditModalVisible(true)}
              >
                Edit Lead
              </Button>
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleDeleteLead}
              >
                Delete
              </Button>
            </Space>
          </div>
          
          {/* Main content tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white rounded-lg shadow">
            {/* Information Tab */}
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  Info
                </span>
              } 
              key="info"
            >
              <div className="p-4">
                <Descriptions 
                  bordered 
                  column={{ xs: 1, sm: 2, md: 3 }}
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="Name">{lead?.name || 'N/A'}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{lead?.phone || 'N/A'}</Descriptions.Item>
                  <Descriptions.Item label="Email">{lead?.email || 'N/A'}</Descriptions.Item>
                  
                  <Descriptions.Item label="Source">
                    {lead?.source ? (
                      <Space>
                        {lead.source === 'Instagram' ? <InstagramOutlined /> : 
                         lead.source === 'Facebook' ? <FacebookOutlined /> : <UserOutlined />}
                        {lead.source}
                      </Space>
                    ) : 'N/A'}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(lead?.status)}>{lead?.status || 'N/A'}</Tag>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Created">
                    {lead?.created_at ? new Date(lead.created_at).toLocaleString() : 'N/A'}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Campaign" span={3}>
                    {lead?.campaign_name || 'No Campaign'}
                  </Descriptions.Item>
                  
                  {lead?.address && (
                    <Descriptions.Item label="Address" span={3}>
                      {lead.address}
                    </Descriptions.Item>
                  )}
                </Descriptions>
                
                {/* Custom fields section */}
                {lead?.custom_fields && Object.keys(lead.custom_fields).length > 0 && (
                  <>
                    <Divider orientation="left">Custom Fields</Divider>
                    <Descriptions 
                      bordered 
                      column={{ xs: 1, sm: 2, md: 3 }}
                      labelStyle={{ fontWeight: 'bold' }}
                    >
                      {Object.entries(lead.custom_fields).map(([key, value]) => (
                        <Descriptions.Item key={key} label={key.replace('_', ' ')}>
                          {value || 'N/A'}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </>
                )}
              </div>
            </TabPane>
            
            {/* Notes Tab */}
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  Notes
                </span>
              } 
              key="notes"
            >
              <div className="p-4">
                <div className="mb-4">
                  <TextArea 
                    rows={4} 
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a new note about this lead..."
                    className="mb-2"
                  />
                  <Button 
                    type="primary" 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
                
                <Divider orientation="left">
                  <Space>
                    <FileTextOutlined />
                    Notes History
                  </Space>
                </Divider>
                
                {ensureArray(lead?.notes).length > 0 ? (
                  <Timeline mode="left">
                    {ensureArray(lead?.notes).map((note, index) => (
                      <Timeline.Item 
                        key={index}
                        color="blue"
                      >
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <Text>{note}</Text>
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              size="small"
                              onClick={() => handleDeleteNote(index)}
                            />
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <Empty description="No notes yet" />
                )}
              </div>
            </TabPane>
            
            {/* Appointments Tab */}
            <TabPane 
              tab={
                <span>
                  <CalendarOutlined />
                  Appointment
                </span>
              } 
              key="appointment"
            >
              <div className="p-4">
                {lead?.appointment ? (
                  <Card className="mb-4">
                    <Descriptions
                      title={
                        <div className="flex justify-between items-center">
                          <Space>
                            <CalendarOutlined />
                            <span>Appointment Details</span>
                          </Space>
                          <Button 
                            type="primary"
                            onClick={() => setIsEditAppointmentModalVisible(true)}
                          >
                            Edit Appointment
                          </Button>
                        </div>
                      }
                      bordered
                    >
                      <Descriptions.Item label="Date">{lead.appointment.date}</Descriptions.Item>
                      <Descriptions.Item label="Time">{lead.appointment.time}</Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag 
                          color={
                            lead.appointment.status === 'scheduled' ? 'green' :
                            lead.appointment.status === 'pending' ? 'orange' :
                            lead.appointment.status === 'completed' ? 'blue' :
                            lead.appointment.status === 'cancelled' ? 'red' : 'default'
                          }
                        >
                          {lead.appointment.status}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Reason" span={3}>
                        {lead.appointment.reason || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Notes" span={3}>
                        {lead.appointment.notes || 'No additional notes'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ) : (
                  <div className="text-center p-6">
                    <Empty 
                      description="No appointments scheduled"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Button 
                      type="primary" 
                      icon={<CalendarOutlined />}
                      onClick={() => setIsSetAppointmentModalVisible(true)}
                      className="mt-4"
                    >
                      Schedule Appointment
                    </Button>
                  </div>
                )}
              </div>
            </TabPane>
            
            {/* Messages Tab */}
            <TabPane 
              tab={
                <span>
                  <MessageOutlined />
                  Messages
                </span>
              } 
              key="messages"
            >
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4 flex flex-col">
                  {conversations.length > 0 && conversations[0].messages ? (
                    ensureArray(conversations[0].messages).map((message, index) => (
                      <div 
                        key={index}
                        className={`mb-2 max-w-3/4 ${
                          message.sender === 'business' 
                            ? 'self-end bg-blue-100 rounded-lg p-2 ml-auto' 
                            : 'self-start bg-gray-200 rounded-lg p-2 mr-auto'
                        }`}
                      >
                        <div className="text-sm font-semibold">
                          {message.sender === 'business' ? 'You' : lead?.name}
                        </div>
                        <div>{message.text}</div>
                        <div className="text-xs text-gray-500 text-right">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty description="No messages yet" className="m-auto" />
                  )}
                </div>
                
                <div className="flex">
                  <Input.TextArea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type your message here..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    className="flex-grow mr-2"
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    disabled={!messageText.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </TabPane>
            
            {/* Tasks Tab */}
            <TabPane 
              tab={
                <span>
                  <CheckCircleOutlined />
                  Tasks
                </span>
              } 
              key="tasks"
            >
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex">
                    <Input
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-grow mr-2"
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddTask}
                      disabled={!newTask.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <Divider orientation="left">Task List</Divider>
                
                {tasks.length > 0 ? (
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <div 
                        key={task.id}
                        className={`flex items-center p-3 rounded border ${
                          task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
                        }`}
                      >
                        <Tooltip title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                          <Button
                            type="text"
                            icon={task.completed ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ClockCircleOutlined />}
                            onClick={() => handleToggleTaskComplete(task.id)}
                            className="mr-2"
                          />
                        </Tooltip>
                        <div className="flex-grow">
                          <div className={task.completed ? 'line-through text-gray-500' : ''}>
                            {task.text}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No tasks yet" />
                )}
              </div>
            </TabPane>
            
            {/* Activity Tab */}
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined />
                  Activity
                </span>
              } 
              key="activities"
            >
              <ActivityTimeline
                activities={activities}
                loading={activitiesLoading}
                onLoadMore={handleLoadMoreActivities}
              />
            </TabPane>
          </Tabs>
          
          {/* Edit Lead Modal */}
          <Modal
            title="Edit Lead"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={lead}
              onFinish={handleEditLead}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the name' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter the phone number' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="source"
                label="Source"
                rules={[{ required: true, message: 'Please select the source' }]}
              >
                <Select>
                  <Option value="Instagram">Instagram</Option>
                  <Option value="Facebook">Facebook</Option>
                  <Option value="Manually Added">Manually Added</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the status' }]}
              >
                <Select>
                  <Option value="New">New</Option>
                  <Option value="Contacted">Contacted</Option>
                  <Option value="Qualified">Qualified</Option>
                  <Option value="Disqualified">Disqualified</Option>
                  <Option value="Proposal Sent">Proposal Sent</Option>
                  <Option value="Negotiation">Negotiation</Option>
                  <Option value="Won">Won</Option>
                  <Option value="Lost">Lost</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="campaign_name"
                label="Campaign"
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="address"
                label="Address"
              >
                <Input.TextArea />
              </Form.Item>
              
              <Form.Item>
                <div className="flex justify-end">
                  <Button onClick={() => setEditModalVisible(false)} className="mr-2">
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          
          {/* Appointment Modals */}
          <SetAppointmentModal
            visible={isSetAppointmentModalVisible}
            onClose={() => setIsSetAppointmentModalVisible(false)}
            onSave={handleSetAppointment}
          />
          
          <EditAppointmentModal
            visible={isEditAppointmentModalVisible}
            onClose={() => setIsEditAppointmentModalVisible(false)}
            onSave={handleEditAppointment}
            appointment={lead?.appointment}
          />
        </div>
      )}
    </div>
  );
};

export default LeadDetailPage; 
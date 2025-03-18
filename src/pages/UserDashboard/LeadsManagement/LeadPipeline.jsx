import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Dropdown, 
  Space, 
  Badge, 
  Tooltip, 
  message, 
  Modal, 
  Empty, 
  Spin,
  Avatar,
  Progress,
  Typography,
  Drawer,
  Form,
  Input,
  Select,
  Statistic,
  notification,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EllipsisOutlined, 
  ArrowRightOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  DragOutlined,
  PushpinOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  CloseCircleOutlined,
  TableOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './LeadPipeline.css';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Define the lead status stages and their order
const LEAD_STAGES = [
  { 
    id: 'new', 
    name: 'New', 
    color: '#1890ff',
    description: 'Newly added leads that need initial contact', 
    icon: <InfoCircleOutlined />
  },
  { 
    id: 'contacted', 
    name: 'Contacted', 
    color: '#faad14',
    description: 'Leads that have been contacted at least once',
    icon: <PhoneOutlined />
  },
  { 
    id: 'qualified', 
    name: 'Qualified', 
    color: '#52c41a',
    description: 'Leads that meet qualification criteria',
    icon: <CheckCircleOutlined />
  },
  { 
    id: 'proposal', 
    name: 'Proposal', 
    color: '#722ed1',
    description: 'Leads that have been sent a proposal',
    icon: <FileSyncOutlined />
  },
  { 
    id: 'negotiation', 
    name: 'Negotiation', 
    color: '#eb2f96',
    description: 'Leads in active negotiation phase',
    icon: <ExclamationCircleOutlined />
  },
  { 
    id: 'won', 
    name: 'Won', 
    color: '#52c41a',
    description: 'Successfully converted leads',
    icon: <CheckCircleOutlined />
  },
  { 
    id: 'lost', 
    name: 'Lost', 
    color: '#f5222d',
    description: 'Lost opportunities',
    icon: <CloseCircleOutlined />
  }
];

const LeadPipeline = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State for leads and UI
  const [pipelineData, setPipelineData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [stageMetrics, setStageMetrics] = useState({});
  const [searchText, setSearchText] = useState('');
  const [isPipelineSettingsVisible, setIsPipelineSettingsVisible] = useState(false);
  const [stageSettings, setStageSettings] = useState([...LEAD_STAGES]);
  
  // Fetch leads data from API
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/crm/leads/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      // Process the API response safely
      let fetchedLeads = [];
      
      if (response.data && Array.isArray(response.data.results)) {
        fetchedLeads = response.data.results;
      } else if (response.data && Array.isArray(response.data)) {
        fetchedLeads = response.data;
      }
      
      // Organize leads by status (pipeline stage)
      const pipelineByStage = {};
      const metrics = {};
      
      // Initialize stages
      stageSettings.forEach(stage => {
        pipelineByStage[stage.id] = [];
        metrics[stage.id] = {
          count: 0,
          value: 0
        };
      });
      
      // Populate stages with leads
      fetchedLeads.forEach(lead => {
        const status = lead.status ? lead.status.toLowerCase() : 'new';
        
        // Only add to valid stages
        if (pipelineByStage[status]) {
          pipelineByStage[status].push({
            ...lead,
            id: lead.id || `lead-${Math.random().toString(36).substr(2, 9)}`,
            key: lead.id || `lead-${Math.random().toString(36).substr(2, 9)}`
          });
          
          // Update metrics
          metrics[status].count += 1;
          metrics[status].value += Number(lead.deal_value || 0);
        }
      });
      
      setPipelineData(pipelineByStage);
      setStageMetrics(metrics);
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error('Failed to load leads data');
    } finally {
      setLoading(false);
    }
  }, [stageSettings]);
  
  // Initial data fetch
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  
  // Handle stage change when a lead is dragged
  const handleDragEnd = async (result) => {
    // Remove dragging class when drag ends
    document.body.classList.remove('dragging-active');
    
    const { source, destination, draggableId } = result;
    
    // Dropped outside of any droppable area
    if (!destination) return;
    
    // No actual change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Find the lead that was moved
    const sourceLead = pipelineData[source.droppableId][source.index];
    
    // Create a new pipeline state after the move
    const newPipelineData = { ...pipelineData };
    
    // Remove from source
    newPipelineData[source.droppableId] = [
      ...pipelineData[source.droppableId].slice(0, source.index),
      ...pipelineData[source.droppableId].slice(source.index + 1)
    ];
    
    // Add to destination
    newPipelineData[destination.droppableId] = [
      ...pipelineData[destination.droppableId].slice(0, destination.index),
      { ...sourceLead, status: destination.droppableId },
      ...pipelineData[destination.droppableId].slice(destination.index)
    ];
    
    // Update state immediately for a responsive feel
    setPipelineData(newPipelineData);
    
    // Update metrics
    const newMetrics = { ...stageMetrics };
    newMetrics[source.droppableId].count -= 1;
    newMetrics[source.droppableId].value -= Number(sourceLead.deal_value || 0);
    newMetrics[destination.droppableId].count += 1;
    newMetrics[destination.droppableId].value += Number(sourceLead.deal_value || 0);
    setStageMetrics(newMetrics);
    
    try {
      // Update the lead status in the API
      await axios.patch(`http://localhost:8000/api/crm/leads/${sourceLead.id}/`, {
        status: destination.droppableId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      // Record a note about the status change
      await axios.post(`http://localhost:8000/api/crm/leads/${sourceLead.id}/notes/`, {
        content: `Lead status changed from "${source.droppableId}" to "${destination.droppableId}"`,
        note_type: 'system'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      message.success(`Lead "${sourceLead.name}" moved to ${destination.droppableId}`);
    } catch (error) {
      console.error('Error updating lead status:', error);
      message.error('Failed to update lead status');
      
      // Revert to original state on error
      setPipelineData(pipelineData);
      setStageMetrics(stageMetrics);
    }
  };
  
  // Handle lead click (view details)
  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsViewDrawerVisible(true);
  };
  
  // Handle edit lead
  const handleEditLead = () => {
    if (!selectedLead) return;
    
    form.setFieldsValue({
      name: selectedLead.name,
      email: selectedLead.email,
      phone: selectedLead.phone,
      company: selectedLead.company,
      status: selectedLead.status,
      source: selectedLead.source,
      deal_value: selectedLead.deal_value,
      notes: selectedLead.notes
    });
    
    setIsEditModalVisible(true);
  };
  
  // Save edited lead
  const handleSaveEdit = async (values) => {
    try {
      await axios.patch(`http://localhost:8000/api/crm/leads/${selectedLead.id}/`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setIsEditModalVisible(false);
      message.success('Lead updated successfully');
      
      // Refresh leads
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      message.error('Failed to update lead');
    }
  };
  
  // Filter leads based on search term
  const getFilteredData = () => {
    if (!searchText) return pipelineData;
    
    const filteredData = {};
    
    Object.keys(pipelineData).forEach(stageId => {
      filteredData[stageId] = pipelineData[stageId].filter(lead => {
        const searchTermLower = searchText.toLowerCase();
        return (
          (lead.name && lead.name.toLowerCase().includes(searchTermLower)) ||
          (lead.email && lead.email.toLowerCase().includes(searchTermLower)) ||
          (lead.phone && lead.phone.toLowerCase().includes(searchTermLower)) ||
          (lead.company && lead.company.toLowerCase().includes(searchTermLower))
        );
      });
    });
    
    return filteredData;
  };
  
  // Function to navigate to detailed lead view
  const goToLeadDetails = (leadId) => {
    navigate(`/dashboard/leads/detail/${leadId}`);
  };
  
  // Update pipeline stage settings
  const handleSaveStageSettings = (values) => {
    setStageSettings(values.stages);
    setIsPipelineSettingsVisible(false);
    
    // Re-fetch leads with new stage settings
    fetchLeads();
  };
  
  // Render the lead card for the pipeline
  const renderLeadCard = (lead, index) => {
    const stageInfo = stageSettings.find(stage => stage.id === lead.status) || LEAD_STAGES[0];
    
    return (
      <Draggable draggableId={String(lead.id)} index={index} key={lead.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`lead-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
            style={{
              ...provided.draggableProps.style,
              borderLeft: `4px solid ${stageInfo.color}`,
              opacity: snapshot.isDragging ? 0.8 : 1,
              transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} rotate(3deg)` : provided.draggableProps.style.transform
            }}
          >
            <div className="lead-card-header" {...provided.dragHandleProps}>
              <Avatar size="small" icon={<UserOutlined />} />
              <div className="lead-name" onClick={() => handleLeadClick(lead)}>
                {lead.name}
              </div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: 'View Details',
                      icon: <EyeOutlined />,
                      onClick: () => goToLeadDetails(lead.id)
                    },
                    {
                      key: '2',
                      label: 'Edit',
                      icon: <EditOutlined />,
                      onClick: () => {
                        setSelectedLead(lead);
                        handleEditLead();
                      }
                    },
                    {
                      key: '3',
                      label: 'Call',
                      icon: <PhoneOutlined />,
                      onClick: () => window.open(`tel:${lead.phone}`, '_self')
                    },
                    {
                      key: '4',
                      label: 'Email',
                      icon: <MailOutlined />,
                      onClick: () => window.open(`mailto:${lead.email}`, '_self')
                    }
                  ]
                }}
                trigger={['click']}
              >
                <Button type="text" size="small" icon={<EllipsisOutlined />} className="lead-options-btn" />
              </Dropdown>
            </div>
            
            <div className="lead-details">
              {lead.company && (
                <div className="lead-company">
                  {lead.company}
                </div>
              )}
              
              <div className="lead-contact">
                {lead.email && (
                  <Tooltip title={lead.email}>
                    <MailOutlined className="lead-icon" />
                  </Tooltip>
                )}
                {lead.phone && (
                  <Tooltip title={lead.phone}>
                    <PhoneOutlined className="lead-icon" />
                  </Tooltip>
                )}
              </div>
              
              {lead.deal_value && (
                <div className="lead-value">
                  <DollarOutlined /> ${parseFloat(lead.deal_value).toLocaleString()}
                </div>
              )}
              
              <div className="lead-footer">
                <div className="lead-tags">
                  <Tag color={stageInfo.color}>{stageInfo.name}</Tag>
                  {lead.source && <Tag>{lead.source}</Tag>}
                </div>
                
                {lead.updated_at && (
                  <div className="lead-lastupdate">
                    <ClockCircleOutlined /> {moment(lead.updated_at).fromNow()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };
  
  // Render each column (stage) in the pipeline
  const renderStage = (stageId, stageInfo, leads) => {
    const metrics = stageMetrics[stageId] || { count: 0, value: 0 };
    
    return (
      <div className="pipeline-stage" key={stageId}>
        <div 
          className="stage-header" 
          style={{ 
            backgroundColor: `${stageInfo.color}20`, 
            borderBottom: `2px solid ${stageInfo.color}` 
          }}
        >
          <div className="stage-title">
            <span className="stage-icon" style={{ color: stageInfo.color }}>
              {stageInfo.icon}
            </span>
            <span className="stage-name">{stageInfo.name}</span>
            <Badge count={metrics.count} className="stage-count" />
          </div>
          <div className="stage-metrics">
            {metrics.value > 0 && (
              <Tooltip title="Total value">
                <span className="stage-value">${metrics.value.toLocaleString()}</span>
              </Tooltip>
            )}
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: 'Add Lead',
                    icon: <PlusOutlined />,
                    onClick: () => {
                      setSelectedLead({ status: stageId });
                      handleEditLead();
                    }
                  }
                ]
              }}
              trigger={['click']}
            >
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
        
        <Droppable droppableId={stageId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`stage-content ${snapshot.isDraggingOver ? 'is-over' : ''}`}
            >
              {leads.length > 0 ? (
                leads.map((lead, index) => renderLeadCard(lead, index))
              ) : (
                <div className="empty-stage">
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="No leads in this stage" 
                    className="empty-stage-content"
                  />
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };
  
  return (
    <div className="lead-pipeline-container">
      <div className="pipeline-header">
        <div>
          <Title level={3} className="pipeline-title">Lead Pipeline</Title>
          <Text type="secondary">Drag and drop leads between stages to update their status</Text>
        </div>
        <div className="pipeline-actions">
          <Input
            placeholder="Search leads"
            prefix={<SearchOutlined />}
            className="pipeline-search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button
            icon={<TableOutlined />}
            onClick={() => navigate('/dashboard/leads')}
          >
            List View
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setSelectedLead(null);
              setIsEditModalVisible(true);
            }}
          >
            Add Lead
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setIsPipelineSettingsVisible(true)}
          >
            Settings
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <Text className="loading-text">Loading leads...</Text>
        </div>
      ) : (
        <DragDropContext 
          onDragStart={() => {
            // Add dragging class to body when drag starts
            document.body.classList.add('dragging-active');
          }} 
          onDragEnd={handleDragEnd}
        >
          <div className="pipeline-content">
            {stageSettings.map(stage => 
              renderStage(
                stage.id, 
                stage, 
                getFilteredData()[stage.id] || []
              )
            )}
          </div>
        </DragDropContext>
      )}
      
      {/* Lead Details Drawer */}
      <Drawer
        title="Lead Details"
        placement="right"
        width={520}
        onClose={() => setIsViewDrawerVisible(false)}
        open={isViewDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => goToLeadDetails(selectedLead?.id)}>View Full Profile</Button>
            <Button type="primary" onClick={handleEditLead}>Edit</Button>
          </Space>
        }
      >
        {selectedLead && (
          <div className="lead-details-drawer">
            <div className="lead-header">
              <Avatar size={64} icon={<UserOutlined />} className="lead-avatar" />
              <div className="lead-info">
                <Title level={4}>{selectedLead.name}</Title>
                {selectedLead.company && <Text>{selectedLead.company}</Text>}
                <div className="lead-tags">
                  <Tag color={LEAD_STAGES.find(s => s.id === selectedLead.status)?.color || '#1890ff'}>
                    {LEAD_STAGES.find(s => s.id === selectedLead.status)?.name || 'New'}
                  </Tag>
                  {selectedLead.source && <Tag>{selectedLead.source}</Tag>}
                </div>
              </div>
            </div>
            
            <Divider />
            
            <div className="lead-contact-details">
              {selectedLead.email && (
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <Text copyable>{selectedLead.email}</Text>
                </div>
              )}
              {selectedLead.phone && (
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <Text copyable>{selectedLead.phone}</Text>
                </div>
              )}
              {selectedLead.deal_value && (
                <div className="contact-item">
                  <DollarOutlined className="contact-icon" />
                  <Text>${parseFloat(selectedLead.deal_value).toLocaleString()}</Text>
                </div>
              )}
              {selectedLead.created_at && (
                <div className="contact-item">
                  <CalendarOutlined className="contact-icon" />
                  <Text>Added on {moment(selectedLead.created_at).format('MMMM D, YYYY')}</Text>
                </div>
              )}
            </div>
            
            <Divider />
            
            <div className="lead-notes">
              <Title level={5}>Notes</Title>
              {selectedLead.notes ? (
                <Paragraph>{selectedLead.notes}</Paragraph>
              ) : (
                <Empty description="No notes available" />
              )}
            </div>
            
            <div className="lead-actions">
              <Button 
                icon={<PhoneOutlined />} 
                onClick={() => window.open(`tel:${selectedLead.phone}`, '_self')}
                disabled={!selectedLead.phone}
              >
                Call
              </Button>
              <Button 
                icon={<MailOutlined />} 
                onClick={() => window.open(`mailto:${selectedLead.email}`, '_self')}
                disabled={!selectedLead.email}
              >
                Email
              </Button>
            </div>
          </div>
        )}
      </Drawer>
      
      {/* Edit Lead Modal */}
      <Modal
        title={selectedLead?.id ? "Edit Lead" : "Add New Lead"}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the lead name' }]}
          >
            <Input placeholder="Enter lead name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          
          <Form.Item
            name="company"
            label="Company"
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            initialValue={selectedLead?.status || 'new'}
          >
            <Select>
              {stageSettings.map(stage => (
                <Option key={stage.id} value={stage.id}>{stage.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="source"
            label="Source"
          >
            <Select placeholder="Select lead source">
              <Option value="Website">Website</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Social Media">Social Media</Option>
              <Option value="Email Campaign">Email Campaign</Option>
              <Option value="Cold Call">Cold Call</Option>
              <Option value="Event">Event</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="deal_value"
            label="Deal Value"
          >
            <Input 
              prefix="$" 
              type="number" 
              min="0" 
              step="0.01" 
              placeholder="Enter deal value"
            />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={4} placeholder="Enter notes about this lead" />
          </Form.Item>
          
          <Form.Item>
            <Space className="form-buttons">
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Pipeline Settings Modal */}
      <Modal
        title="Pipeline Settings"
        open={isPipelineSettingsVisible}
        onCancel={() => setIsPipelineSettingsVisible(false)}
        footer={null}
        width={720}
      >
        <Form
          initialValues={{ stages: stageSettings }}
          onFinish={handleSaveStageSettings}
        >
          <Form.List name="stages">
            {(fields, { add, remove, move }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="stage-setting-item">
                    <Space align="baseline" style={{ width: '100%' }}>
                      <DragOutlined className="drag-handle" />
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing stage name' }]}
                        style={{ marginBottom: 0, width: '25%' }}
                      >
                        <Input placeholder="Stage Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        rules={[{ required: true, message: 'Missing stage ID' }]}
                        style={{ marginBottom: 0, width: '20%' }}
                      >
                        <Input placeholder="Stage ID" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'color']}
                        rules={[{ required: true, message: 'Missing color' }]}
                        style={{ marginBottom: 0, width: '20%' }}
                      >
                        <Input type="color" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        style={{ marginBottom: 0, width: '30%' }}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                      <Button 
                        danger 
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                      />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add({ 
                      id: `stage-${fields.length + 1}`, 
                      name: 'New Stage', 
                      color: '#1890ff',
                      description: ''
                    })} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Add Pipeline Stage
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <div className="settings-actions">
            <Button onClick={() => setIsPipelineSettingsVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadPipeline;
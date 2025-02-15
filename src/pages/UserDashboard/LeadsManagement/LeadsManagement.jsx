import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Upload, Pagination, Modal, Form, message, Popconfirm, Tag } from 'antd';
import { UploadOutlined, DownloadOutlined, FilterOutlined, CloseOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CloudUploadOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
// import './LeadsManagement.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

import { SetAppointmentModal, EditAppointmentModal } from '../../../components';

// Register components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const { Search, TextArea } = Input;
const { Option } = Select;

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]); // Filtered leads for the table
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form] = Form.useForm();
  const [selectedLead, setSelectedLead] = useState({
    id: "10",
    name: "Sophia Clark",
    phone: "+1 (012) 345-6789",
    email: "sophiaclark@example.com",
    source: "Manually Added",
    status: "Contacted",
    notes: [],
    appointment: null, // Example: no appointment yet
  }); // Lead to display in the view modal
  const [newNote, setNewNote] = useState(''); // New note to be added
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  const [showImportModal, setShowImportModal] = useState(false);
  const [showPostSelectionModal, setShowPostSelectionModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [fetchedLeads, setFetchedLeads] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showDMConfirmationModal, setShowDMConfirmationModal] = useState(false);

  const [isSetAppointmentModalVisible, setisSetAppointmentModalVisible] = useState(false);
  const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);



  useEffect(() => {
    fetchLeads();
    fetchLeadDetails("");
  }, [page, pageSize, statusFilter, sourceFilter]);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, statusFilter, sourceFilter, page, pageSize]);

  // Fetch Posts
  const fetchPostsForSelection = async () => {
    setShowPostSelectionModal(true);
    try {
      const response = await axios.get('http://localhost:3000/posts');
      setPosts(response.data);
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Failed to fetch posts.');
    }
  };

  // Fetch Leads from Social Media
  const fetchLeadsFromSocialMedia = async (type, postIds = []) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/Leads', {
        type,
        postIds,
      });
      setFetchedLeads(response.data);
      console.log(response.data);

      setShowPostSelectionModal(false);
      setShowImportModal(false);
      setShowReviewModal(true);
      setShowDMConfirmationModal(true);
      // message.success(`${response.data.leads.length} leads fetched successfully!`);
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error('Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  };



  // Approve Fetched Leads
  const approveFetchedLeads = async () => {
    try {
      await axios.post('/api/leads/import', { leads: fetchedLeads });
      message.success(`${fetchedLeads.length} leads imported successfully!`);
      setShowReviewModal(false);
      fetchLeads();
    } catch (error) {
      console.error('Error approving leads:', error);
      message.error('Failed to import leads.');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    await axios
      .get(`http://localhost:3000/Leads`, {
        params: {
          page,
          pageSize,
          status: statusFilter,
          source: sourceFilter,
        },
      })
      .then((response) => {
        setLeads(response.data);
        setTotal(response.data);
      })
      .catch((error) => console.error('Error fetching leads:', error))
      .finally(() => setLoading(false));
  };

  // Handle User Choice for DMs
  const handleSendDMChoice = async (sendDMToAll) => {
    setShowDMConfirmationModal(false);
    if (sendDMToAll) {
      try {
        for (const lead of fetchedLeads) {
          await sendDM(lead);
        }
        message.success(
          `${fetchedLeads.length} leads imported and DMs sent successfully!`
        );
      } catch (error) {
        console.error('Error sending DMs:', error);
        message.error('Failed to send some DMs.');
      }
    } else {
      message.info('Leads imported without sending DMs.');
    }
    fetchLeads(); // Refresh the table
  };

  // Send DM to Leads
  const sendDM = async (lead) => {
    try {
      const messageTemplate = `Hi ${lead.name || 'there'}! Thank you for your interest. Could you please share your contact details (phone and email) so we can assist you better?`;
      const response = await axios.post('/api/social-media/send-dm', {
        leadId: lead.id,
        message: messageTemplate,
      });
      if (response.data.status === 'success') {
        updateLeadDMStatus(lead.id, 'Sent');
        message.success('DM sent successfully!');
      } else {
        updateLeadDMStatus(lead.id, 'Failed');
        message.error('Failed to send DM.');
      }
    } catch (error) {
      console.error('Error sending DM:', error);
      updateLeadDMStatus(lead.id, 'Failed');
      message.error('Failed to send DM.');
    }
  };

  // Simulate Webhook for Responses
  const processResponses = (leadId, responseMessage) => {
    const phoneRegex = /(\+?\d{1,3})?[-.\s]?(\d{10})/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    const phone = responseMessage.match(phoneRegex)?.[0] || null;
    const email = responseMessage.match(emailRegex)?.[0] || null;

    if (phone || email) {
      updateLeadContactDetails(leadId, { phone, email, dmStatus: 'Responded' });
      message.success('Lead details updated from response!');
    } else {
      message.warning('No contact details found in the response.');
    }
  };

  const updateLeadDMStatus = (leadId, status) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, dmStatus: status } : lead
      )
    );
  };

  const updateLeadContactDetails = (leadId, updatedFields) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, ...updatedFields } : lead
      )
    );
  };

  const handleAddLead = (values) => {
    axios
      .post('http://localhost:3000/Leads', values)
      .then(() => {
        message.success('Lead added successfully!');
        fetchLeads();
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(() => {
        message.error('Failed to add lead!');
      });
  };



  const handleImportLeads = () => {
    // Placeholder for social media leads import functionality
    message.info('Import leads from social media is not yet implemented.');
  };

  const authenticateWithSocialMedia = async () => {
    // Simulate social media authentication process
    message.info('Redirecting to social media authentication...');
    // Replace with actual OAuth authentication logic
    return true;
  };





  const calculateAnalytics = () => {
    const leadsByStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const leadsBySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    const leadsGrowth = leads.reduce((acc, lead) => {
      const date = lead.created_at;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const leadsGrowthTrend = Object.keys(leadsGrowth)
      .sort()
      .map((date) => ({ date, count: leadsGrowth[date] }));

    return { leadsByStatus, leadsBySource, leadsGrowthTrend };
  };

  const analyticsData = calculateAnalytics();

  const leadsByStatusData = {
    labels: Object.keys(analyticsData.leadsByStatus),
    datasets: [
      {
        data: Object.values(analyticsData.leadsByStatus),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
        hoverBackgroundColor: ['#66bb6a', '#ffa726', '#ef5350', '#42a5f5'],
      },
    ],
  };

  const leadsBySourceData = {
    labels: Object.keys(analyticsData.leadsBySource),
    datasets: [
      {
        label: 'Leads by Source',
        data: Object.values(analyticsData.leadsBySource),
        backgroundColor: ['#2196f3', '#f44336', '#4caf50'],
      },
    ],
  };

  const leadsGrowthData = {
    labels: analyticsData.leadsGrowthTrend.map((entry) => entry.date),
    datasets: [
      {
        label: 'Leads Growth',
        data: analyticsData.leadsGrowthTrend.map((entry) => entry.count),
        fill: false,
        borderColor: '#4caf50',
        tension: 0.1,
      },
    ],
  };





  const handleViewLead = (lead) => {
    fetchLeadDetails(lead.id);
    setSelectedLead(lead);
    setIsViewModalVisible(true);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      message.warning('Please enter a note.');
      return;
    }
    const updatedNotes = [
      ...(selectedLead.notes || []),
      { text: newNote, date: new Date().toLocaleString() },
    ];
    // Update in backend and state
    const updatedLead = { ...selectedLead, notes: [...(selectedLead.notes || []), newNote] };
    try {
      await axios.put(`http://localhost:3000/Leads/${selectedLead.id}`, updatedLead);
      setSelectedLead(updatedLead);
      console.log(updatedLead);

      setNewNote('');
      fetchLeads();
      message.success('Note added successfully!');
    } catch (error) {
      message.error('Failed to add note.');
    }
  };

  const deleteNote = async (noteToDelete) => {
    // Ensure that the note exists
    if (!noteToDelete) {
      message.warning('Note not found.');
      return;
    }

    // Filter out the note from the selectedLead's notes
    const updatedNotes = (selectedLead.notes || []).filter(note => note.text !== noteToDelete.text);

    // Update the selectedLead object
    const updatedLead = { ...selectedLead, notes: updatedNotes };

    try {
      // Update the backend by sending the PUT request
      await axios.put(`http://localhost:3000/Leads/${selectedLead.id}`, updatedLead);

      // Update the state
      setSelectedLead(updatedLead);
      console.log('Updated lead after note deletion:', updatedLead);

      // Optionally fetch updated leads if needed
      fetchLeads();

      // Success message
      message.success('Note deleted successfully!');
    } catch (error) {
      message.error('Failed to delete note.');
    }
  };

  // Fetch lead details including appointments
  const fetchLeadDetails = async (leadId) => {
    try {
      // Fetch lead details
      const leadResponse = await axios.get(`http://localhost:3000/Leads/${leadId}`);

      // Fetch all appointments for this lead
      const appointmentResponse = await axios.get(
        `http://localhost:3000/Appointments?leadId=${leadId}`
      );

      // Update state with lead and its appointments
      setSelectedLead({
        ...leadResponse.data,
        appointment: appointmentResponse.data.length ? appointmentResponse.data[0] : null,
      });
    } catch (error) {
      console.error('Error fetching lead details:', error);
      message.error('Failed to fetch lead details.');
    }
  };




  // Save a new appointment
  const handleSetAppointment = async (appointmentData) => {
    try {
      const response = await axios.post(`http://localhost:3000/Appointments`, {
        leadId: selectedLead.id,
        ...appointmentData,
      });
      setSelectedLead((prev) => ({ ...prev, appointment: response.data }));
      setisSetAppointmentModalVisible(false);
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
        `http://localhost:3000/Appointments/${selectedLead.appointment.id}`,
        updatedAppointment
      );
      setSelectedLead((prev) => ({ ...prev, appointment: response.data }));
      setIsEditAppointmentModalVisible(false);
      message.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      message.error('Failed to update appointment.');
    }
  };




  const handleEditLead = (values) => {
    if (editingLead) {
      axios
        .put(`http://localhost:3000/Leads/${editingLead.id}`, values)
        .then(() => {
          message.success('Lead updated successfully!');
          fetchLeads();
          setIsEditModalVisible(false);
          setEditingLead(null);
        })
        .catch(() => {
          message.error('Failed to update lead!');
        });
    }
  };

  const handleDeleteLead = (id) => {
    axios
      .delete(`http://localhost:3000/Leads/${id}`)
      .then(() => {
        message.success('Lead deleted successfully!');
        fetchLeads();
      })
      .catch(() => {
        message.error('Failed to delete lead!');
      });
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setIsEditModalVisible(true);
    form.setFieldsValue(lead);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };


  const applyFilters = () => {
    let filtered = leads;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((lead) =>
        Object.values(lead)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter) {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    // Paginate the results
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    setFilteredLeads(paginated);
    setTotal(filtered.length);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1); // Reset to the first page on search
  };



  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSourceFilter('');
    setPage(1);
    setPageSize(10);
  };

  const handlePageChange = (page) => setPage(page);

  const handlePageSizeChange = (current, size) => setPageSize(size);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      filters: [
        { text: 'Instagram', value: 'Instagram' },
        { text: 'Facebook', value: 'Facebook' },
        { text: 'Manually Added', value: 'Manually Added' },
      ],
      onFilter: (value, record) => record.source === value,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'DM Status',
      dataIndex: 'dmStatus',
      key: 'dmStatus',
      render: (status) => {
        const color =
          status === 'Sent'
            ? 'blue'
            : status === 'Responded'
              ? 'green'
              : status === 'Failed'
                ? 'red'
                : 'gray';
        return <Tag color={color}>{status || 'Pending'}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="actions-column">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewLead(record)}>
            View
          </Button>
          <Button
            type="link"
            icon={<MessageOutlined />}
            onClick={() => sendDM(record)}
            disabled={record.dmStatus === 'Sent' || record.dmStatus === 'Responded'}
          >
            Send DM
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDeleteLead(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="leads-management">


      <div className="analytics">
        <div className="chart">
          <h3>Leads by Status</h3>
          <Pie data={leadsByStatusData} />
        </div>
        <div className="chart">
          <h3>Leads by Source</h3>
          <Bar data={leadsBySourceData} />
        </div>
        <div className="chart">
          <h3>Leads Growth Trend</h3>
          <Line data={leadsGrowthData} />
        </div>
      </div>


      <div className="header">
        <h2>Leads Management</h2>
        <div className="actions">
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={() => setShowImportModal(true)}
          >
            Import Leads from Social Media
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Manually Add Entry
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => { }}>
            Export CSV
          </Button>
          <Upload beforeUpload={() => false} onChange={() => { }} showUploadList={false}>
            <Button type="default" icon={<UploadOutlined />}>
              Import CSV
            </Button>
          </Upload>
          <Button type="default" onClick={handleToggleFilters} icon={showFilters ? <CloseOutlined /> : <FilterOutlined />}>
            {showFilters ? 'Close Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="filters">
          <Search placeholder="Search leads" onSearch={handleSearch} allowClear />
          <Select
            placeholder="Filter by status"
            onChange={(value) => setStatusFilter(value || '')}
            value={statusFilter || undefined}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="New">New</Option>
            <Option value="Contacted">Contacted</Option>
            <Option value="Qualified">Qualified</Option>
            <Option value="Disqualified">Disqualified</Option>
          </Select>
          <Select
            placeholder="Filter by source"
            onChange={(value) => setSourceFilter(value || '')}
            value={sourceFilter || undefined}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="Instagram">Instagram</Option>
            <Option value="Facebook">Facebook</Option>
            <Option value="Manually Added">Manually Added</Option>
          </Select>
          <Button type="default" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      <Table
        dataSource={filteredLeads}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          total,
          pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          onShowSizeChange: handlePageSizeChange,
        }}
      />

      {/* Add Lead Modal */}
      <Modal
        title="Manually Add Entry"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Add Lead"
      >
        <Form form={form} layout="vertical" onFinish={handleAddLead}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item
            label="Source"
            name="source"
            rules={[{ required: true, message: 'Please select the source!' }]}
          >
            <Select>
              <Option value="Instagram">Instagram</Option>
              <Option value="Facebook">Facebook</Option>
              <Option value="Manually Added">Manually Added</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="New">New</Option>
              <Option value="Contacted">Contacted</Option>
              <Option value="Qualified">Qualified</Option>
              <Option value="Disqualified">Disqualified</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        title="Edit Lead"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingLead(null);
        }}
        onOk={() => form.submit()}
        okText="Save Changes"
      >
        <Form form={form} layout="vertical" onFinish={handleEditLead}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item
            label="Source"
            name="source"
            rules={[{ required: true, message: 'Please select the source!' }]}
          >
            <Select>
              <Option value="Instagram">Instagram</Option>
              <Option value="Facebook">Facebook</Option>
              <Option value="Manually Added">Manually Added</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="New">New</Option>
              <Option value="Contacted">Contacted</Option>
              <Option value="Qualified">Qualified</Option>
              <Option value="Disqualified">Disqualified</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for view Leads */}
      <Modal
        title="Lead Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {selectedLead && (
          <div>
            {/* Lead Information */}
            <div style={{ marginBottom: 20 }}>
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Source:</strong> {selectedLead.source}</p>
              <p><strong>Status:</strong> {selectedLead.status}</p>
              <p>
                <strong>DM Status:</strong>{' '}
                <span style={{ color: selectedLead.dmStatus === 'Sent' ? 'green' : 'red' }}>
                  {selectedLead.dmStatus || 'Pending'}
                </span>
                {selectedLead.dmStatus === 'Failed' && (
                  <Button
                    type="link"
                    style={{ marginLeft: 10 }}
                    onClick={() => sendDM(selectedLead)}
                  >
                    Retry DM
                  </Button>
                )}
              </p>
            </div>

            {/* Notes Section */}
            <div style={{ marginBottom: 20 }}>
              <strong>Notes:</strong>
              <TextArea
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                style={{ marginBottom: 10 }}
              />
              <Button type="primary" onClick={handleAddNote} style={{ marginBottom: 20 }}>
                Add Note
              </Button>
              <div>
                <strong>Previous Notes:</strong>

                <ul style={{ listStyleType: 'disc', marginLeft: 20 }}>
                  {(selectedLead.notes || []).map((note, index) => (
                    <li key={index} style={{ marginBottom: 5 }}>
                      <span>{note}</span>{' '}
                      <small style={{ color: '#999' }}>({note.date})</small>
                      <Button
                        type="link"
                        danger
                        style={{ marginLeft: 10 }}
                        onClick={() => deleteNote(selectedLead.id, index)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Appointment Section */}
            <div style={{ marginBottom: 20 }}>
              <strong>Appointment:</strong>
              {selectedLead.appointment ? (
                <div style={{ marginTop: 10 }}>
                  <p><strong>Date:</strong> {selectedLead.appointment.date}</p>
                  <p><strong>Status:</strong> {selectedLead.appointment.status}</p>
                  <p><strong>Reason:</strong> {selectedLead.appointment.reason}</p>
                  <p><strong>Time:</strong> {selectedLead.appointment.time}</p>
                  <Button type="default" onClick={() => setIsEditAppointmentModalVisible(true)}>
                    Edit Appointment
                  </Button>
                </div>
              ) : (
                <Button type="primary" onClick={() => setisSetAppointmentModalVisible(true)
                }>
                  Set Appointment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <SetAppointmentModal
        visible={isSetAppointmentModalVisible}
        onClose={() => setisSetAppointmentModalVisible(false)}
        onSave={handleSetAppointment}
      />

      {/* Edit Appointment Modal */}
      <EditAppointmentModal
        visible={isEditAppointmentModalVisible}
        onClose={() => setIsEditAppointmentModalVisible(false)}
        onSave={handleEditAppointment}
        appointment={selectedLead.appointment}
      />


      {/* <Modal
        title="Review Fetched Leads"
        open={showReviewModal} // State to control modal visibility
        onCancel={() => setShowReviewModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>,
          <Button key="approve" type="primary" onClick={approveLeads}>
            Approve All
          </Button>,
        ]}
      >
        <Table
          dataSource={fetchedLeads} // State holding fetched leads
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Phone', dataIndex: 'phone', key: 'phone' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Source', dataIndex: 'source', key: 'source' },
          ]}
          rowKey="id"
        />
      </Modal> */}

      <Modal
        title="Import Leads from Social Media"
        open={showImportModal}
        onCancel={() => setShowImportModal(false)}
        footer={null}
      >
        <Button
          type="primary"
          style={{ marginBottom: 10, width: '100%' }}
          onClick={() => fetchLeadsFromSocialMedia('all')}
        >
          Import Leads from All Posts
        </Button>
        <Button
          type="default"
          style={{ width: '100%' }}
          onClick={fetchPostsForSelection}
        >
          Select Specific Post(s)
        </Button>
      </Modal>

      <Modal
        title="Select Post(s)"
        open={showPostSelectionModal}
        onCancel={() => setShowPostSelectionModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowPostSelectionModal(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => fetchLeadsFromSocialMedia('specific', selectedPosts)}
            disabled={!selectedPosts.length}
          >
            Fetch Leads
          </Button>,
        ]}
      >
        <Table
          dataSource={posts}
          rowSelection={{
            onChange: (keys) => setSelectedPosts(keys),
          }}
          columns={[
            {
              title: 'Thumbnail',
              dataIndex: 'media_url',
              key: 'media_url',
              render: (url) => <img src={url} alt="Post Thumbnail" style={{ width: '50px', height: '50px' }} />
            },
            { title: 'Post ID', dataIndex: 'id', key: 'id' },
            { title: 'Caption', dataIndex: 'caption', key: 'caption' },
            { title: 'Date', dataIndex: 'created_at', key: 'created_at' },
            { title: 'Engagement', dataIndex: 'engagement', key: 'engagement' }, // optional
            {
              title: 'Post Link',
              dataIndex: 'link',
              key: 'link',
              render: (link) => <a href={link} target="_blank" rel="noopener noreferrer">View on Instagram</a>
            }
          ]}
          rowKey="id"
          scroll={{ x: true }} // This adds horizontal scrolling to the table
        />
      </Modal>

      <Modal
        title="Review Fetched Leads"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>,
          <Button key="approve" type="primary" onClick={approveFetchedLeads}>
            Approve All
          </Button>,
        ]}
      >
        <Table
          dataSource={fetchedLeads}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Send DMs to Fetched Leads?"
        open={showDMConfirmationModal}
        onCancel={() => setShowDMConfirmationModal(false)}
        footer={[
          <Button key="no" onClick={() => handleSendDMChoice(false)}>
            No
          </Button>,
          <Button key="yes" type="primary" onClick={() => handleSendDMChoice(true)}>
            Yes
          </Button>,
        ]}
      >
        <p>Would you like to send DMs to all fetched leads automatically?</p>
      </Modal>



    </div>
  );
};

export default LeadsManagement;

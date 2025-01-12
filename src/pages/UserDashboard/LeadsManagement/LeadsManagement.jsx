import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Upload, Pagination, Modal, Form, message, Popconfirm } from 'antd';
import { UploadOutlined, DownloadOutlined, FilterOutlined, CloseOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import './LeadsManagement.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

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
  const [selectedLead, setSelectedLead] = useState(null); // Lead to display in the view modal
  const [newNote, setNewNote] = useState(''); // New note to be added
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state


  useEffect(() => {
    fetchLeads();
  }, [page, pageSize, statusFilter, sourceFilter]);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, statusFilter, sourceFilter, page, pageSize]);

  const fetchLeads = () => {
    setLoading(true);
    axios
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
    setSelectedLead(lead);
    setIsViewModalVisible(true);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      message.warning('Please enter a note!');
      return;
    }

    const updatedLead = { ...selectedLead, notes: [...(selectedLead.notes || []), newNote] };
    axios
      .put(`http://localhost:3000/Leads/${selectedLead.id}`, updatedLead)
      .then(() => {
        message.success('Note added successfully!');
        setSelectedLead(updatedLead);
        setNewNote('');
        fetchLeads();
      })
      .catch(() => {
        message.error('Failed to add note!');
      });
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
    { title: 'Source', dataIndex: 'source', key: 'source' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="actions-column">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewLead(record)}>
            View
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
            <p><strong>Name:</strong> {selectedLead.name}</p>
            <p><strong>Phone:</strong> {selectedLead.phone}</p>
            <p><strong>Email:</strong> {selectedLead.email}</p>
            <p><strong>Source:</strong> {selectedLead.source}</p>
            <p><strong>Status:</strong> {selectedLead.status}</p>
            <div>
              <TextArea
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
              />
              <Button type="primary" onClick={handleAddNote} style={{ marginTop: 10 }}>
                Add Note
              </Button>
            </div>
            <div style={{ marginTop: 20 }}>
              <strong>Previous Notes:</strong>
              <ul>
                {(selectedLead.notes || []).map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadsManagement;

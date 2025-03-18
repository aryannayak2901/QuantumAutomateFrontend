import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Card, 
  Space, 
  Dropdown, 
  Row, 
  Col, 
  Statistic, 
  Spin, 
  Tooltip,
  message,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  FilterOutlined, 
  CloseOutlined, 
  MoreOutlined, 
  PhoneOutlined, 
  MessageOutlined, 
  UserOutlined, 
  ArrowUpOutlined,
  SortAscendingOutlined,
  FileExcelOutlined,
  BarChartOutlined,
  ReloadOutlined,
  ProjectOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LeadListPage.css';
import LeadFilter from './LeadFilter';
import LeadForm from './LeadForm';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// Status color mapping function
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

// Enhanced safety check for arrays - can be used across the component
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  return [];
};

const LeadListPage = () => {
  const navigate = useNavigate();
  
  // State for leads data and pagination
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    campaign: '',
    searchTerm: '',
    sortField: 'created_at',
    sortDirection: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for metrics
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    loading: true
  });
  
  // Lists for filter options
  const [campaigns, setCampaigns] = useState([]);
  const [sources, setSources] = useState([]);
  
  // Add new state for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Fetch data on component mount
  useEffect(() => {
    fetchLeads();
    fetchCampaigns();
    fetchSources();
    fetchMetrics();
  }, []);
  
  // Apply filters when filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, leads]);
  
  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Get leads data from API
      const response = await axios.get('http://localhost:8000/api/leads/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
          page: page,
          page_size: pageSize,
          ...filters
        }
      });
      
      // Process the API response safely
      let fetchedLeads = [];
      
      if (response.data && Array.isArray(response.data.results)) {
        fetchedLeads = response.data.results;
        setTotal(response.data.count || response.data.results.length);
      } else if (response.data && Array.isArray(response.data)) {
        fetchedLeads = response.data;
        setTotal(response.data.length);
      }
      
      // Ensure each lead has an id for the rowKey prop
      fetchedLeads = fetchedLeads.map((lead, index) => ({
        ...lead,
        key: lead.id || `lead-${index}`, // Ensure there's always a key property
        id: lead.id || `lead-${index}`   // Ensure there's always an id property
      }));
      
      setLeads(fetchedLeads);
      setFilteredLeads(fetchedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error('Failed to load leads data');
      setLeads([]);
      setFilteredLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch campaign list for filters
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/campaigns/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setCampaigns(response.data.map(campaign => campaign.name));
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };
  
  // Fetch source options for filters
  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lead-sources/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setSources(response.data.map(source => source.name));
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };
  
  // Fetch metrics for dashboard
  const fetchMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/crm/leads/metrics/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data) {
        setMetrics({
          totalLeads: response.data.total_leads || 0,
          newLeads: response.data.new_leads || 0,
          qualifiedLeads: response.data.qualified_leads || 0,
          conversionRate: response.data.conversion_rate || 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching lead metrics:', error);
      setMetrics(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Handle page change in pagination
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    fetchLeads();
  };
  
  // Handle search input
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };
  
  // Toggle filter visibility
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      source: '',
      campaign: '',
      searchTerm: '',
      sortField: 'created_at',
      sortDirection: 'desc'
    });
  };
  
  // Handle sorting column headers
  const handleSort = (field) => {
    setFilters(prev => {
      const newDirection = prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        sortField: field,
        sortDirection: newDirection
      };
    });
  };
  
  // Export leads to CSV
  const handleExportToCSV = () => {
    try {
      // Create CSV content from filteredLeads
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Source', 'Campaign'];
      const csvContent = [
        headers.join(','),
        ...filteredLeads.map(lead => [
          lead.name || '',
          lead.email || '',
          lead.phone || '',
          lead.status || '',
          lead.source || '',
          lead.campaign_name || ''
        ].join(','))
      ].join('\n');
      
      // Create a download link and trigger download
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Leads exported successfully!');
    } catch (error) {
      console.error('Error exporting leads:', error);
      message.error('Failed to export leads');
    }
  };
  
  // Apply filters to leads
  const applyFilters = () => {
    if (!Array.isArray(leads)) {
      setFilteredLeads([]);
      return;
    }
    
    let result = [...leads];
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
        (lead.phone && lead.phone.toLowerCase().includes(searchLower)) ||
        (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
        (lead.notes && lead.notes.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        result = result.filter(lead => filters.status.includes(lead.status));
      } else {
        result = result.filter(lead => lead.status === filters.status);
      }
    }
    
    // Apply source filter
    if (filters.source) {
      if (Array.isArray(filters.source)) {
        result = result.filter(lead => filters.source.includes(lead.source));
      } else {
        result = result.filter(lead => lead.source === filters.source);
      }
    }
    
    // Apply campaign filter
    if (filters.campaign) {
      if (Array.isArray(filters.campaign)) {
        result = result.filter(lead => filters.campaign.includes(lead.campaign_name));
      } else {
        result = result.filter(lead => lead.campaign_name === filters.campaign);
      }
    }
    
    // Apply date range filter if present
    if (filters.dateRange && Array.isArray(filters.dateRange) && filters.dateRange.length === 2) {
      const [startStr, endStr] = filters.dateRange;
      if (startStr && endStr) {
        const startDate = dayjs(startStr);
        const endDate = dayjs(endStr).endOf('day'); // Set to end of day
        
        result = result.filter(lead => {
          const leadDate = dayjs(lead.created_at);
          return leadDate.isAfter(startDate) && leadDate.isBefore(endDate);
        });
      }
    }
    
    // Apply additional filters if present
    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
      result = result.filter(lead => {
        if (!lead.tags || !Array.isArray(lead.tags)) return false;
        return filters.tags.some(tag => lead.tags.includes(tag));
      });
    }
    
    if (filters.assignedTo && Array.isArray(filters.assignedTo) && filters.assignedTo.length > 0) {
      result = result.filter(lead => filters.assignedTo.includes(lead.assigned_to));
    }
    
    // Apply sorting
    if (filters.sortField) {
      result.sort((a, b) => {
        let valueA = a[filters.sortField] || '';
        let valueB = b[filters.sortField] || '';
        
        // Handle date fields
        if (filters.sortField === 'created_at' || filters.sortField === 'updated_at' || filters.sortField === 'last_contacted_at') {
          valueA = valueA ? dayjs(valueA) : dayjs(0);
          valueB = valueB ? dayjs(valueB) : dayjs(0);
        }
        // Handle string comparison
        else if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        if (valueA.isBefore && valueB.isBefore) {
          return filters.sortDirection === 'asc' ? 
            (valueA.isBefore(valueB) ? -1 : 1) : 
            (valueA.isBefore(valueB) ? 1 : -1);
        }
        
        if (valueA < valueB) return filters.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return filters.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredLeads(result);
    setTotal(result.length);
  };
  
  // Handle filter changes from the LeadFilter component
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Handle modal visibility
  const showModal = (mode = 'create', lead = null) => {
    setModalMode(mode);
    setSelectedLead(lead);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedLead(null);
    setModalMode('create');
  };

  const handleLeadSave = async (leadData) => {
    await fetchLeads(); // Refresh the leads list
    setIsModalVisible(false);
    setSelectedLead(null);
    setModalMode('create');
  };

  // Add actions menu for each row
  const getActionMenu = (record) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => showModal('edit', record),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => handleDeleteLead(record.id),
    },
  ];

  // Handle lead deletion
  const handleDeleteLead = async (leadId) => {
    try {
      await axios.delete(`/api/crm/leads/${leadId}/`);
      message.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      message.error('Failed to delete lead');
    }
  };

  const fetchActivities = async (leadId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/crm/leads/${leadId}/custom-activities/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to load activities');
      return [];
    }
  };

  const columns = [
    {
      title: (
        <div className="sortable-header" onClick={() => handleSort('name')}>
          Name 
          {filters.sortField === 'name' && (
            <SortAscendingOutlined 
              className={`sort-icon ${filters.sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
            />
          )}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 150,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <a onClick={() => showModal('edit', record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div className="sortable-header" onClick={() => handleSort('source')}>
          Source
          {filters.sortField === 'source' && (
            <SortAscendingOutlined 
              className={`sort-icon ${filters.sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
            />
          )}
        </div>
      ),
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: (
        <div className="sortable-header" onClick={() => handleSort('status')}>
          Status
          {filters.sortField === 'status' && (
            <SortAscendingOutlined 
              className={`sort-icon ${filters.sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
            />
          )}
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Campaign',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      width: 150,
      render: (text) => <span>{text || 'N/A'}</span>,
    },
    {
      title: 'Last Contact',
      dataIndex: 'last_contacted',
      key: 'last_contacted',
      width: 150,
      render: (date) => <span>{date ? new Date(date).toLocaleDateString() : 'Never'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenu(record) }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="lead-list-container">
      {/* Page Header */}
      <div className="lead-list-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="lead-list-title text-2xl font-bold mb-2">Lead Management</h1>
          <p className="lead-list-description text-gray-500">View, filter, and manage your leads</p>
        </div>
        <div className="lead-list-actions flex mt-4 md:mt-0 space-x-2">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal('create')}
          >
            Add Lead
          </Button>
          <Button
            type="default"
            icon={<FileExcelOutlined />}
            onClick={handleExportToCSV}
          >
            Export
          </Button>
          <Button
            type="default"
            icon={<BarChartOutlined />}
            onClick={() => navigate('/dashboard/leads/analytics')}
          >
            Analytics
          </Button>
          <Button
            type="default"
            icon={<ProjectOutlined />}
            onClick={() => navigate('/dashboard/leads/pipeline')}
          >
            Pipeline
          </Button>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="metric-card">
            <Statistic
              title="Total Leads"
              value={metrics.totalLeads}
              loading={metrics.loading}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="metric-card">
            <Statistic
              title="New Leads"
              value={metrics.newLeads}
              loading={metrics.loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="metric-card">
            <Statistic
              title="Qualified Leads"
              value={metrics.qualifiedLeads}
              loading={metrics.loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="metric-card">
            <Statistic
              title="Conversion Rate"
              value={metrics.conversionRate}
              loading={metrics.loading}
              precision={1}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* LeadFilter Component */}
      <LeadFilter 
        onFilterChange={handleFilterChange} 
        initialValues={filters}
        compact={true}
      />

      {/* Table Section */}
      <div className="table-container overflow-hidden">
        <div className="table-header border-b">
          <h2 className="table-title">Leads</h2>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchLeads}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={ensureArray(filteredLeads)}
            columns={columns}
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: handlePageChange,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
              className: "p-4"
            }}
            scroll={{ x: 'max-content' }}
            rowKey={record => record.id || record.key || Math.random().toString(36).substr(2, 9)}
            className={loading ? 'loading-pulse' : ''}
          />
        </div>
      </div>

      {/* Lead Form Modal */}
      <Modal
        title={modalMode === 'create' ? 'Add New Lead' : 'Edit Lead'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <LeadForm
          mode={modalMode}
          lead={selectedLead}
          onSave={handleLeadSave}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default LeadListPage;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Tag,
    Switch,
    Drawer,
    Space,
    Popover,
    message,
    Divider,
    Collapse,
    Modal,
    Tooltip,
    Row,
    Col,
    Typography,
    Spin
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    SaveOutlined,
    DeleteOutlined,
    EditOutlined,
    SettingOutlined,
    PlusOutlined,
    CloseOutlined,
    CalendarOutlined,
    DownOutlined,
    UpOutlined,
    StarOutlined,
    StarFilled,
    EyeOutlined,
    EyeInvisibleOutlined,
    CheckOutlined,
    RightOutlined,
    LeftOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    DollarOutlined,
    FileOutlined,
    PhoneOutlined,
    MessageOutlined,
    TagOutlined,
    BarsOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import './LeadFilter.css';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Text, Title } = Typography;

// Date presets for quick selection
const datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this-week' },
    { label: 'Last Week', value: 'last-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'Last 30 Days', value: 'last-30-days' },
    { label: 'Last 90 Days', value: 'last-90-days' },
    { label: 'This Quarter', value: 'this-quarter' },
    { label: 'Last Quarter', value: 'last-quarter' },
    { label: 'This Year', value: 'this-year' },
    { label: 'Last Year', value: 'last-year' },
];

const LeadFilter = ({ onFilterChange, initialValues = {}, compact = false, showSavedFilters = true }) => {
    const [form] = Form.useForm();
    const [saveForm] = Form.useForm();
    const [advancedMode, setAdvancedMode] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [saveFilterVisible, setSaveFilterVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [editFilterVisible, setEditFilterVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
        sources: [],
        campaigns: [],
        assignedTo: [],
        tags: [],
        leadScores: [],
        pipelines: [],
        stages: [],
    });

    // Save filters to local storage
    const [savedFilters, setSavedFilters] = useLocalStorage('lead-filters', []);

    // Fetch filter options from API
    const fetchFilterOptions = useCallback(async () => {
        try {
            setLoading(true);

            // Example API calls - replace with actual endpoints
            const [statusesRes, sourcesRes, campaignsRes, usersRes, tagsRes] = await Promise.all([
                axios.get('/api/lead-statuses'),
                axios.get('/api/lead-sources'),
                axios.get('/api/campaigns'),
                axios.get('/api/users'),
                axios.get('/api/tags'),
            ]);

            // Mock data for demonstration - replace with actual API responses
            setFilterOptions({
                statuses: statusesRes.data?.data || ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost', 'Archived'],
                sources: sourcesRes.data?.data || ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Event', 'Partner'],
                campaigns: campaignsRes.data?.data || ['Spring Sale', 'Summer Campaign', 'Product Launch', 'Holiday Special', 'Webinar Follow-up'],
                assignedTo: usersRes.data?.data || ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams'],
                tags: tagsRes.data?.data || ['VIP', 'Hot Lead', 'Needs Follow-up', 'Decision Maker', 'Budget Holder', 'Technical Contact'],
                leadScores: Array.from({ length: 10 }, (_, i) => String(i + 1)),
                pipelines: ['Sales Pipeline', 'Marketing Pipeline', 'Partner Pipeline'],
                stages: ['Awareness', 'Interest', 'Consideration', 'Intent', 'Evaluation', 'Purchase'],
            });
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
            message.error('Failed to load filter options. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize component with data
    useEffect(() => {
        fetchFilterOptions();

        // Set initial values if provided
        if (initialValues && Object.keys(initialValues).length > 0) {
            // Convert date range to dayjs objects if present
            const formValues = { ...initialValues };
            if (formValues.dateRange && Array.isArray(formValues.dateRange)) {
                formValues.dateRange = formValues.dateRange.map(date => 
                    date ? dayjs(date) : null
                ).filter(Boolean);
            }
            // Ensure array values for multiple selects
            ['status', 'source', 'campaign', 'tags', 'stage'].forEach(field => {
                if (formValues[field] && !Array.isArray(formValues[field])) {
                    formValues[field] = [formValues[field]];
                }
            });
            form.setFieldsValue(formValues);
        } else {
            // If no initial values, reset to empty state
            form.resetFields();
        }
    }, [fetchFilterOptions, form, initialValues]);

    // Handle filter submission
    const handleSubmit = (values) => {
        // Convert dayjs objects to ISO strings for API
        const processedValues = { ...values };
        if (processedValues.dateRange && Array.isArray(processedValues.dateRange)) {
            processedValues.dateRange = processedValues.dateRange.map(date => 
                date ? date.toISOString() : null
            ).filter(Boolean);
        }
        
        if (onFilterChange) {
            onFilterChange(processedValues);
        }
        setDrawerVisible(false);
    };

    // Save filter as preset
    const handleSaveFilter = () => {
        const values = form.getFieldsValue();
        setSaveFilterVisible(true);
        saveForm.setFieldsValue({
            name: '',
            description: '',
            isDefault: false,
            filterData: values
        });
    };

    // Save filter submission
    const handleSaveFilterSubmit = () => {
        const values = saveForm.getFieldsValue();

        if (!values.name) {
            message.error('Filter name is required');
            return;
        }

        // Check if filter name already exists
        const exists = savedFilters.some(filter =>
            filter.name.toLowerCase() === values.name.toLowerCase() &&
            (!selectedFilter || selectedFilter.id !== filter.id)
        );

        if (exists) {
            message.error('A filter with this name already exists');
            return;
        }

        let newFilters;

        if (editFilterVisible && selectedFilter) {
            // Edit existing filter
            newFilters = savedFilters.map(filter =>
                filter.id === selectedFilter.id
                    ? {
                        ...filter,
                        name: values.name,
                        description: values.description,
                        isDefault: values.isDefault,
                        filterData: values.filterData,
                        updatedAt: new Date().toISOString()
                    }
                    : filter
            );

            message.success('Filter updated successfully');
        } else {
            // Create new filter
            const newFilter = {
                id: Date.now().toString(),
                name: values.name,
                description: values.description,
                isDefault: values.isDefault,
                filterData: values.filterData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            newFilters = [...savedFilters, newFilter];
            message.success('Filter saved successfully');
        }

        // If this is set as default, unset others
        if (values.isDefault) {
            newFilters = newFilters.map(filter => ({
                ...filter,
                isDefault: filter.id === (selectedFilter ? selectedFilter.id : newFilters[newFilters.length - 1].id)
            }));
        }

        setSavedFilters(newFilters);
        setSaveFilterVisible(false);
        setEditFilterVisible(false);
        setSelectedFilter(null);
    };

    // Delete filter
    const handleDeleteFilter = () => {
        if (!selectedFilter) return;

        const newFilters = savedFilters.filter(filter => filter.id !== selectedFilter.id);
        setSavedFilters(newFilters);
        message.success('Filter deleted successfully');
        setConfirmDeleteVisible(false);
        setSelectedFilter(null);
    };

    // Apply saved filter
    const handleApplyFilter = (filter) => {
        if (!filter || !filter.filterData) return;

        // Create a copy of the filter data to modify
        const processedFilterData = { ...filter.filterData };

        // Convert dateRange to dayjs objects if present
        if (processedFilterData.dateRange && Array.isArray(processedFilterData.dateRange)) {
            processedFilterData.dateRange = processedFilterData.dateRange.map(date => 
                date ? dayjs(date) : null
            ).filter(Boolean);
        }

        // Set the form values with processed data
        form.setFieldsValue(processedFilterData);

        if (onFilterChange) {
            onFilterChange(filter.filterData);
        }
    };

    // Edit saved filter
    const handleEditFilter = (filter) => {
        setSelectedFilter(filter);
        setEditFilterVisible(true);

        saveForm.setFieldsValue({
            name: filter.name,
            description: filter.description,
            isDefault: filter.isDefault,
            filterData: filter.filterData
        });
    };

    // Reset filter form
    const handleReset = () => {
        // First reset all fields to undefined
        const emptyValues = {
            searchTerm: '',
            status: [],
            source: [],
            campaign: [],
            assignedTo: [],
            dateRange: null,
            tags: [],
            leadScore: undefined,
            pipeline: undefined,
            stage: [],
            hasPhone: false,
            hasEmail: false,
            lastContactDays: undefined,
            dealValue: undefined,
            activity: undefined
        };
        
        // Reset the form completely
        form.resetFields();
        
        // Force update with empty values
        form.setFieldsValue(emptyValues);
        
        // Reset all form fields to initial state
        Object.keys(form.getFieldsValue()).forEach(key => {
            form.setFields([{
                name: key,
                value: Array.isArray(emptyValues[key]) ? [] : emptyValues[key],
                errors: []
            }]);
        });

        // Reset advanced mode and other states
        setAdvancedMode(false);
        
        // Notify parent component of reset with empty values
        if (onFilterChange) {
            onFilterChange({});
        }

        // Close drawer if open
        setDrawerVisible(false);

        // Show success message
        message.success('Filters have been reset');
    };

    // Toggle drawer visibility
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    // Handle date preset selection
    const handleDatePresetSelect = (preset) => {
        const now = dayjs();
        let startDate = null;
        let endDate = null;

        switch (preset.value) {
            case 'today':
                startDate = now.startOf('day');
                endDate = now.endOf('day');
                break;
            case 'yesterday':
                startDate = now.subtract(1, 'day').startOf('day');
                endDate = now.subtract(1, 'day').endOf('day');
                break;
            case 'this-week':
                startDate = now.startOf('week');
                endDate = now.endOf('week');
                break;
            case 'last-week':
                startDate = now.subtract(1, 'week').startOf('week');
                endDate = now.subtract(1, 'week').endOf('week');
                break;
            case 'this-month':
                startDate = now.startOf('month');
                endDate = now.endOf('month');
                break;
            case 'last-month':
                startDate = now.subtract(1, 'month').startOf('month');
                endDate = now.subtract(1, 'month').endOf('month');
                break;
            case 'last-30-days':
                startDate = now.subtract(30, 'days').startOf('day');
                endDate = now.endOf('day');
                break;
            case 'last-90-days':
                startDate = now.subtract(90, 'days').startOf('day');
                endDate = now.endOf('day');
                break;
            case 'this-quarter':
                startDate = now.startOf('quarter');
                endDate = now.endOf('quarter');
                break;
            case 'last-quarter':
                startDate = now.subtract(1, 'quarter').startOf('quarter');
                endDate = now.subtract(1, 'quarter').endOf('quarter');
                break;
            case 'this-year':
                startDate = now.startOf('year');
                endDate = now.endOf('year');
                break;
            case 'last-year':
                startDate = now.subtract(1, 'year').startOf('year');
                endDate = now.subtract(1, 'year').endOf('year');
                break;
            default:
                break;
        }

        if (startDate && endDate) {
            form.setFieldsValue({ dateRange: [startDate, endDate] });
            handleSubmit(form.getFieldsValue());
        }
    };

    // Render saved filters section
    const renderSavedFilters = () => {
        if (!showSavedFilters || savedFilters.length === 0) return null;

        return (
            <div className="saved-filters-list">
                <Divider>Saved Filters</Divider>
                {savedFilters.map(filter => (
                    <div key={filter.id} className="saved-filter-item">
                        <div className="saved-filter-header">
                            <div className="filter-title-row">
                                {filter.isDefault && <StarFilled style={{ color: '#faad14' }} />}
                                <Text strong>{filter.name}</Text>
                            </div>
                            <div className="filter-actions">
                                <Tooltip title="Apply Filter">
                                    <Button
                                        icon={<CheckOutlined />}
                                        size="small"
                                        type="text"
                                        onClick={() => handleApplyFilter(filter)}
                                    />
                                </Tooltip>
                                <Tooltip title="Edit Filter">
                                    <Button
                                        icon={<EditOutlined />}
                                        size="small"
                                        type="text"
                                        onClick={() => handleEditFilter(filter)}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete Filter">
                                    <Button
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        type="text"
                                        danger
                                        onClick={() => {
                                            setSelectedFilter(filter);
                                            setConfirmDeleteVisible(true);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        {filter.description && (
                            <Text type="secondary">{filter.description}</Text>
                        )}
                        <div className="filter-summary">
                            {Object.entries(filter.filterData || {}).map(([key, value]) => {
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                return (
                                    <Tag key={key} color="blue">
                                        {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render compact filter form
    const renderCompactFilter = () => {
        const defaultFilter = savedFilters.find(filter => filter.isDefault);

        return (
            <Card className="compact-filter-card">
                <div className="compact-filter-header">
                    <Title level={5}>Lead Filters</Title>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={toggleDrawer}
                    >
                        Advanced Filters
                    </Button>
                </div>

                <Form
                    layout="horizontal"
                    form={form}
                    onFinish={handleSubmit}
                    className="lead-filter-form"
                >
                    <div className="compact-filter-row">
                        <Form.Item name="searchTerm" className="compact-search-item">
                            <Input
                                placeholder="Search leads..."
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item name="status" className="compact-select-item">
                            <Select
                                placeholder="Status"
                                allowClear
                                showSearch
                            >
                                {filterOptions.statuses.map(status => (
                                    <Option key={status} value={status}>{status}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="source" className="compact-select-item">
                            <Select
                                placeholder="Source"
                                allowClear
                                showSearch
                            >
                                {filterOptions.sources.map(source => (
                                    <Option key={source} value={source}>{source}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="compact-button-group">
                            <Button
                                onClick={handleReset}
                                icon={<ReloadOutlined />}
                            >
                                Reset
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </Form>

                {showSavedFilters && savedFilters.length > 0 && (
                    <div className="saved-filters-bar">
                        <Text type="secondary" style={{ marginRight: '8px' }}>Saved:</Text>
                        <div className="saved-filter-chips">
                            {savedFilters.slice(0, 3).map(filter => (
                                <Tag
                                    key={filter.id}
                                    className="saved-filter-chip"
                                    color={filter.isDefault ? 'blue' : 'default'}
                                    icon={filter.isDefault ? <StarFilled /> : null}
                                    onClick={() => handleApplyFilter(filter)}
                                >
                                    {filter.name}
                                </Tag>
                            ))}

                            {savedFilters.length > 3 && (
                                <Popover
                                    title="All Saved Filters"
                                    content={
                                        <div className="saved-filters-popover">
                                            {savedFilters.map(filter => (
                                                <div key={filter.id} className="saved-filter-popover-item">
                                                    <Text
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleApplyFilter(filter)}
                                                    >
                                                        {filter.isDefault && <StarFilled style={{ color: '#faad14', marginRight: '4px' }} />}
                                                        {filter.name}
                                                    </Text>
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        size="small"
                                                        type="text"
                                                        onClick={() => handleEditFilter(filter)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    trigger="click"
                                    placement="bottomRight"
                                >
                                    <Tag className="saved-filter-chip" style={{ cursor: 'pointer' }}>
                                        +{savedFilters.length - 3} more
                                    </Tag>
                                </Popover>
                            )}
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    // Render date presets
    const renderDatePresets = () => (
        <div className="date-presets">
            <Text className="date-presets-label">Quick date ranges:</Text>
            <div className="date-preset-tags">
                {datePresets.slice(0, advancedMode ? datePresets.length : 6).map(preset => (
                    <Tag
                        key={preset.value}
                        className="date-preset-tag"
                        icon={<CalendarOutlined />}
                        onClick={() => handleDatePresetSelect(preset)}
                    >
                        {preset.label}
                    </Tag>
                ))}
            </div>
        </div>
    );

    // Define Collapse items
    const collapseItems = [
        {
            key: '1',
            label: 'Basic Filters',
            children: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="status" label="Status">
                                <Select
                                    placeholder="Select status"
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                >
                                    {filterOptions.statuses.map(status => (
                                        <Option key={status} value={status}>{status}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="source" label="Source">
                                <Select
                                    placeholder="Select source"
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                >
                                    {filterOptions.sources.map(source => (
                                        <Option key={source} value={source}>{source}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="campaign" label="Campaign">
                                <Select
                                    placeholder="Select campaign"
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                >
                                    {filterOptions.campaigns.map(campaign => (
                                        <Option key={campaign} value={campaign}>{campaign}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="assignedTo" label="Assigned To">
                                <Select
                                    placeholder="Select assignee"
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                >
                                    {filterOptions.assignedTo.map(user => (
                                        <Option key={user} value={user}>{user}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="dateRange" label="Date Range">
                        <RangePicker 
                            style={{ width: '100%' }}
                            showTime={false}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    {renderDatePresets()}
                </>
            )
        },
        {
            key: '2',
            label: 'Advanced Filters',
            children: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="tags" label="Tags">
                                <Select
                                    placeholder="Select tags"
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                >
                                    {filterOptions.tags.map(tag => (
                                        <Option key={tag} value={tag}>{tag}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="leadScore" label="Minimum Lead Score">
                                <Select
                                    placeholder="Select minimum score"
                                    allowClear
                                >
                                    {filterOptions.leadScores.map(score => (
                                        <Option key={score} value={score}>{score}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="pipeline" label="Pipeline">
                                <Select
                                    placeholder="Select pipeline"
                                    allowClear
                                >
                                    {filterOptions.pipelines.map(pipeline => (
                                        <Option key={pipeline} value={pipeline}>{pipeline}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="stage" label="Stage">
                                <Select
                                    placeholder="Select stage"
                                    allowClear
                                    mode="multiple"
                                >
                                    {filterOptions.stages.map(stage => (
                                        <Option key={stage} value={stage}>{stage}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="hasPhone" label="Phone Contact" valuePropName="checked">
                                <Switch checkedChildren="Has phone" unCheckedChildren="Any" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="hasEmail" label="Email Contact" valuePropName="checked">
                                <Switch checkedChildren="Has email" unCheckedChildren="Any" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="lastContactDays" label="Last Contact">
                                <Select
                                    placeholder="Last contacted within"
                                    allowClear
                                >
                                    <Option value="1">Today</Option>
                                    <Option value="7">Last 7 days</Option>
                                    <Option value="14">Last 14 days</Option>
                                    <Option value="30">Last 30 days</Option>
                                    <Option value="90">Last 90 days</Option>
                                    <Option value="never">Never contacted</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dealValue" label="Deal Value">
                                <Select
                                    placeholder="Minimum deal value"
                                    allowClear
                                >
                                    <Option value="1000">$1,000+</Option>
                                    <Option value="5000">$5,000+</Option>
                                    <Option value="10000">$10,000+</Option>
                                    <Option value="25000">$25,000+</Option>
                                    <Option value="50000">$50,000+</Option>
                                    <Option value="100000">$100,000+</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="activity" label="Activity">
                        <Select
                            placeholder="Select activity filter"
                            allowClear
                        >
                            <Option value="with-appointments">With scheduled appointments</Option>
                            <Option value="with-tasks">With open tasks</Option>
                            <Option value="with-notes">With notes</Option>
                            <Option value="with-calls">With call history</Option>
                            <Option value="no-activity">No recent activity</Option>
                        </Select>
                    </Form.Item>
                </>
            )
        }
    ];

    return (
        <>
            {compact ? renderCompactFilter() : (
                <Card title="Lead Filters" extra={
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={toggleDrawer}
                    >
                        Advanced Filters
                    </Button>
                }>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="lead-filter-form"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item name="searchTerm" label="Search">
                                    <Input
                                        placeholder="Search by name, email, phone..."
                                        prefix={<SearchOutlined />}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                <Form.Item name="status" label="Status">
                                    <Select
                                        placeholder="Status"
                                        allowClear
                                        showSearch
                                    >
                                        {filterOptions.statuses.map(status => (
                                            <Option key={status} value={status}>{status}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                <Form.Item name="source" label="Source">
                                    <Select
                                        placeholder="Source"
                                        allowClear
                                        showSearch
                                    >
                                        {filterOptions.sources.map(source => (
                                            <Option key={source} value={source}>{source}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                    Search
                                </Button>
                                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                                    Reset
                                </Button>
                                <Button
                                    type="dashed"
                                    onClick={handleSaveFilter}
                                    icon={<SaveOutlined />}
                                >
                                    Save Filter
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    {renderSavedFilters()}
                </Card>
            )}

            {/* Advanced Filter Drawer */}
            <Drawer
                title="Advanced Lead Filters"
                placement="right"
                width={600}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                footer={
                    <div className="drawer-footer">
                        <Button onClick={handleReset} icon={<ReloadOutlined />}>
                            Reset
                        </Button>
                        <Button
                            type="dashed"
                            onClick={handleSaveFilter}
                            icon={<SaveOutlined />}
                        >
                            Save Filter
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            icon={<FilterOutlined />}
                        >
                            Apply Filters
                        </Button>
                    </div>
                }
            >
                <Spin spinning={loading}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="lead-filter-form"
                    >
                        <Form.Item name="searchTerm" label="Search">
                            <Input
                                placeholder="Search by name, email, phone, company..."
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Form.Item>

                        <Collapse defaultActiveKey={['1']} className="filter-collapse" items={collapseItems} />

                        {/* Filter mode toggle */}
                        <div className="filter-mode-toggle">
                            <Switch
                                checked={advancedMode}
                                onChange={setAdvancedMode}
                                style={{ marginRight: '8px' }}
                            />
                            <Text>{advancedMode ? 'Advanced Mode' : 'Basic Mode'}</Text>
                        </div>

                        {renderSavedFilters()}
                    </Form>
                </Spin>
            </Drawer>

            {/* Save Filter Modal */}
            <Modal
                title={editFilterVisible ? "Edit Filter" : "Save Filter"}
                open={saveFilterVisible || editFilterVisible}
                onCancel={() => {
                    setSaveFilterVisible(false);
                    setEditFilterVisible(false);
                    setSelectedFilter(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setSaveFilterVisible(false);
                        setEditFilterVisible(false);
                        setSelectedFilter(null);
                    }}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSaveFilterSubmit}>
                        {editFilterVisible ? 'Update' : 'Save'}
                    </Button>
                ]}
            >
                <Form form={saveForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Filter Name"
                        rules={[{ required: true, message: 'Please enter a name for this filter' }]}
                    >
                        <Input placeholder="Enter a name for this filter" />
                    </Form.Item>

                    <Form.Item name="description" label="Description (optional)">
                        <Input.TextArea
                            placeholder="Enter a description for this filter"
                            autoSize={{ minRows: 2, maxRows: 4 }}
                        />
                    </Form.Item>

                    <Form.Item name="isDefault" valuePropName="checked">
                        <Switch checkedChildren="Default Filter" unCheckedChildren="Set as Default" />
                    </Form.Item>

                    <Form.Item name="filterData" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                title="Delete Filter"
                open={confirmDeleteVisible}
                onCancel={() => {
                    setConfirmDeleteVisible(false);
                    setSelectedFilter(null);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setConfirmDeleteVisible(false);
                        setSelectedFilter(null);
                    }}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDeleteFilter}>
                        Delete
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete the filter "{selectedFilter?.name}"? This action cannot be undone.</p>
            </Modal>
        </>
    );
};

export default LeadFilter; 
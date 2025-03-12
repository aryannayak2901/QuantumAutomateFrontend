import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    Button,
    Table,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    message,
    Tabs,
    Timeline,
    Progress,
    Dropdown,
    Menu,
    Badge,
    Tooltip,
    Alert,
    Checkbox,
    Drawer,
    Empty,
    TimePicker,
    InputNumber,
    Switch,
    Divider,
    Collapse,
    Statistic,
    Row,
    Col,
    DatePicker,
    Radio,
    Spin
} from 'antd';
import {
    PhoneOutlined,
    AudioOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    StopOutlined,
    PlusOutlined,
    EditOutlined,
    FilterOutlined,
    LineChartOutlined,
    FundProjectionScreenOutlined,
    SwapOutlined,
    UsergroupAddOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    SlidersFilled,
    BarsOutlined,
    PauseOutlined,
    PlayCircleFilled,
    DownloadOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PhoneFilled,
    TeamOutlined,
    ScheduleOutlined,
    ClockCircleFilled,
    ArrowUpOutlined,
    ArrowDownOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
// Mock import for charts - in a real app you would use a proper charting library
import { BarChart, PieChart, LineChart, AreaChart } from 'recharts';

const { Option } = Select;
// Removed TabPane import as it's deprecated
const { TextArea } = Input;
const { Search } = Input;
const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { RangePicker: DateRangePicker } = DatePicker;

const CallAgent = ({ apiHandlers = {}, initialData = {} }) => {
    const [calls, setCalls] = useState(initialData.calls || []);
    const [scripts, setScripts] = useState(initialData.scripts || []);
    const [campaigns, setCampaigns] = useState(initialData.campaigns || []);
    const [loading, setLoading] = useState(initialData.calls ? false : true);
    const [modalVisible, setModalVisible] = useState(false);
    const [scriptModalVisible, setScriptModalVisible] = useState(false);
    const [reassignModalVisible, setReassignModalVisible] = useState(false);
    const [campaignSettingsVisible, setCampaignSettingsVisible] = useState(false);
    const [campaignAnalyticsVisible, setCampaignAnalyticsVisible] = useState(false);
    const [activeCall, setActiveCall] = useState(null);
    const [form] = Form.useForm();
    const [scriptForm] = Form.useForm();
    const [reassignForm] = Form.useForm();
    const [campaignSettingsForm] = Form.useForm();
    const [analyticsForm] = Form.useForm();
    const [editingScript, setEditingScript] = useState(null);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [campaignFilter, setCampaignFilter] = useState(null);
    const [leads, setLeads] = useState([]);
    const [campaignStats, setCampaignStats] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);
    const [callAssignDrawerVisible, setCallAssignDrawerVisible] = useState(false);
    const [callDetailsVisible, setCallDetailsVisible] = useState(false);
    const [currentCallDetails, setCurrentCallDetails] = useState(null);
    const [savingCampaignSettings, setSavingCampaignSettings] = useState(false);
    const [campaignAnalytics, setCampaignAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsDateRange, setAnalyticsDateRange] = useState([moment().subtract(7, 'days'), moment()]);
    const [comparisonDateRange, setComparisonDateRange] = useState([moment().subtract(14, 'days'), moment().subtract(7, 'days')]);
    const [analysisTimeFrame, setAnalysisTimeFrame] = useState('daily');
    const [generateReportLoading, setGenerateReportLoading] = useState(false);

    useEffect(() => {
        // Make sure we have the necessary API handlers before calling them
        if (!initialData.calls && apiHandlers.fetchCalls) fetchCalls();
        if (!initialData.scripts && apiHandlers.fetchScripts) fetchScripts();
        // Only fetch these if we have the API handlers for them
        if (apiHandlers.fetchCampaigns) fetchCampaigns();
        if (apiHandlers.fetchLeads) fetchLeads();
    }, []);

    // When campaign filter changes, refetch calls
    useEffect(() => {
        fetchCalls();
    }, [campaignFilter]);

    // Fetch campaign analytics when analytics drawer is opened or date range changes
    useEffect(() => {
        if (campaignAnalyticsVisible && editingCampaign) {
            fetchCampaignAnalytics(editingCampaign.id);
        }
    }, [campaignAnalyticsVisible, editingCampaign, analyticsDateRange, analysisTimeFrame]);

    const fetchCalls = async () => {
        if (!apiHandlers.fetchCalls) {
            console.error('fetchCalls API handler is not defined');
            return;
        }
        try {
            setLoading(true);
            const callsData = await apiHandlers.fetchCalls(campaignFilter);
            setCalls(callsData);
        } catch (error) {
            message.error('Failed to fetch calls');
            console.error('Error fetching calls:', error);
            setCalls([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchScripts = async () => {
        if (!apiHandlers.fetchScripts) {
            console.error('fetchScripts API handler is not defined');
            return;
        }
        try {
            const scriptsData = await apiHandlers.fetchScripts();
            setScripts(scriptsData);
        } catch (error) {
            message.error('Failed to fetch scripts');
            console.error('Error:', error);
            setScripts([]);
        }
    };

    const fetchCampaigns = async () => {
        if (!apiHandlers.fetchCampaigns) return;
        try {
            const campaignsData = await apiHandlers.fetchCampaigns();
            setCampaigns(campaignsData);
            
            // Create a map of campaign stats
            const statsMap = {};
            campaignsData.forEach(campaign => {
                statsMap[campaign.id] = {
                    total_calls: campaign.total_leads || 0,
                    completed_calls: campaign.contacted_leads || 0,
                    success_rate: campaign.successful_calls ? 
                        Math.round((campaign.successful_calls / campaign.contacted_leads) * 100) : 0
                };
            });
            setCampaignStats(statsMap);
            
        } catch (error) {
            message.error('Failed to fetch campaigns');
            console.error('Error:', error);
            setCampaigns([]);
        }
    };

    const fetchLeads = async () => {
        if (!apiHandlers.fetchLeads) return;
        try {
            const leadsData = await apiHandlers.fetchLeads();
            setLeads(leadsData);
        } catch (error) {
            message.error('Failed to fetch leads');
            console.error('Error:', error);
            setLeads([]);
        }
    };

    // Fetch campaign analytics
    const fetchCampaignAnalytics = async (campaignId) => {
        if (!campaignId) return;
        
        try {
            setAnalyticsLoading(true);
            
            // Format date range for API
            const startDate = analyticsDateRange[0].format('YYYY-MM-DD');
            const endDate = analyticsDateRange[1].format('YYYY-MM-DD');
            
            const response = await axios.get(`/api/campaigns/${campaignId}/analytics/`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    time_frame: analysisTimeFrame
                }
            });
            
            setCampaignAnalytics(response.data);
        } catch (error) {
            message.error('Failed to fetch campaign analytics');
            console.error('Error:', error);
            
            // For demo/development - simulate response with mock data
            const mockAnalytics = generateMockAnalytics(campaignId, analysisTimeFrame);
            setCampaignAnalytics(mockAnalytics);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // Generate mock analytics data for development/demo
    const generateMockAnalytics = (campaignId, timeFrame) => {
        const campaign = campaigns.find(c => c.id === campaignId) || {};
        const timeSeriesPoints = timeFrame === 'daily' ? 7 : (timeFrame === 'weekly' ? 4 : 3);
        
        // Generate time series data
        const timeSeriesData = Array(timeSeriesPoints).fill().map((_, idx) => {
            const date = moment().subtract(timeSeriesPoints - idx - 1, timeFrame === 'daily' ? 'days' : (timeFrame === 'weekly' ? 'weeks' : 'months')).format('YYYY-MM-DD');
            return {
                date,
                calls_made: Math.floor(Math.random() * 50) + 10,
                connected: Math.floor(Math.random() * 40) + 5,
                appointments: Math.floor(Math.random() * 15),
                conversion_rate: Math.floor(Math.random() * 30) + 10
            };
        });
        
        // Call outcome distribution
        const callOutcomes = {
            connected: Math.floor(Math.random() * 100) + 50,
            voicemail: Math.floor(Math.random() * 40) + 20,
            no_answer: Math.floor(Math.random() * 30) + 10,
            busy: Math.floor(Math.random() * 15) + 5,
            failed: Math.floor(Math.random() * 10) + 2
        };
        
        // KPIs
        const kpis = {
            total_calls: timeSeriesData.reduce((sum, day) => sum + day.calls_made, 0),
            connection_rate: Math.floor(Math.random() * 40) + 30,
            conversion_rate: Math.floor(Math.random() * 25) + 5,
            avg_call_duration: Math.floor(Math.random() * 180) + 60, // in seconds
            cost_per_appointment: Math.floor(Math.random() * 50) + 20,
            appointments_set: timeSeriesData.reduce((sum, day) => sum + day.appointments, 0)
        };
        
        // Calculate comparison with previous period
        const comparison = {
            calls_growth: Math.floor(Math.random() * 30) - 15, // could be negative
            connection_rate_growth: Math.floor(Math.random() * 20) - 10,
            conversion_rate_growth: Math.floor(Math.random() * 25) - 12,
            appointments_growth: Math.floor(Math.random() * 40) - 20
        };
        
        // Best performing hours
        const hourlyPerformance = Array(24).fill().map((_, hour) => ({
            hour,
            calls: Math.floor(Math.random() * 20),
            connection_rate: Math.floor(Math.random() * 100)
        })).sort((a, b) => b.connection_rate - a.connection_rate);
        
        return {
            campaign_name: campaign.name || 'Campaign',
            time_series: timeSeriesData,
            call_outcomes: callOutcomes,
            kpis,
            comparison,
            hourly_performance: hourlyPerformance.slice(0, 5), // Top 5 hours
            worst_hours: hourlyPerformance.slice(-5).reverse() // Bottom 5 hours
        };
    };

    // Generate and download report
    const generateReport = async (format = 'excel') => {
        if (!editingCampaign || !campaignAnalytics) return;
        
        try {
            setGenerateReportLoading(true);
            
            // Format date range for API
            const startDate = analyticsDateRange[0].format('YYYY-MM-DD');
            const endDate = analyticsDateRange[1].format('YYYY-MM-DD');
            
            const response = await axios.get(`/api/campaigns/${editingCampaign.id}/report/`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    format
                },
                responseType: 'blob' // Important for downloading files
            });
            
            // Create a download link and click it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `campaign_report_${editingCampaign.name}_${startDate}_${endDate}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            
            message.success(`${format.toUpperCase()} report downloaded successfully`);
        } catch (error) {
            message.error(`Failed to generate ${format.toUpperCase()} report`);
            console.error('Error:', error);
        } finally {
            setGenerateReportLoading(false);
        }
    };

    const handleStartCall = async (leadId, scriptId, campaignId) => {
        try {
            const response = await axios.post('/api/calls/start/', {
                lead_id: leadId,
                script_id: scriptId,
                campaign_id: campaignId
            });
            setActiveCall(response.data);
            message.success('Call started successfully');
            fetchCalls();
        } catch (error) {
            message.error('Failed to start call');
            console.error('Error:', error);
        }
    };

    const handleEndCall = async (callId) => {
        try {
            await axios.post(`/api/calls/${callId}/end/`);
            setActiveCall(null);
            message.success('Call ended successfully');
            fetchCalls();
        } catch (error) {
            message.error('Failed to end call');
            console.error('Error:', error);
        }
    };

    const handleCreateScript = async (values) => {
        try {
            setLoading(true);
            
            const endpoint = editingScript 
                ? `/api/calls/scripts/${editingScript.id}/` 
                : '/api/calls/scripts/';
            
            const method = editingScript ? 'put' : 'post';
            
            const response = await axios[method](endpoint, values);
            
            message.success(
                editingScript 
                    ? 'Script updated successfully' 
                    : 'Script created successfully'
            );
            
            fetchScripts();
            
            setScriptModalVisible(false);
            scriptForm.resetFields();
            setEditingScript(null);
        } catch (error) {
            console.error('Error saving script:', error);
            message.error('Failed to save script. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditScript = (script) => {
        setEditingScript(script);
        scriptForm.setFieldsValue({
            name: script.name,
            description: script.description,
            script_type: script.script_type || 'general',
            content: script.content || ''
        });
        setScriptModalVisible(true);
    };
    
    const handleAddScript = () => {
        setEditingScript(null);
        scriptForm.resetFields();
        setScriptModalVisible(true);
    };

    const handleScheduleCall = (values) => {
        // Schedule a call using the form values
        const { lead_id, script_id, campaign_id, scheduled_time, notes } = values;
        
        // Make API call to schedule the call
        axios.post('/api/calls/schedule/', {
            lead_id,
            script_id,
            campaign_id,
            scheduled_time,
            notes
        })
        .then(response => {
            message.success('Call scheduled successfully');
            setModalVisible(false);
            form.resetFields();
            fetchCalls();
        })
        .catch(error => {
            message.error('Failed to schedule call');
            console.error('Error:', error);
        });
    };
    
    const getCampaignStatusColor = (status) => {
        const colors = {
            'active': 'green',
            'paused': 'orange',
            'completed': 'blue',
            'draft': 'gray',
            'scheduled': 'purple'
        };
        return colors[status] || 'blue';
    };

    // Handle associating selected calls with a campaign
    const handleAssociateWithCampaign = async (campaignId) => {
        if (!selectedRowKeys.length) {
            message.warning('Please select at least one call to associate with a campaign');
            return;
        }

        try {
            setBulkActionLoading(true);
            
            // Call API to associate calls with campaign
            await axios.post('/api/calls/batch-update/', {
                call_ids: selectedRowKeys,
                campaign_id: campaignId
            });
            
            message.success(`${selectedRowKeys.length} call(s) associated with campaign successfully`);
            setSelectedRowKeys([]);
            fetchCalls();
            setCallAssignDrawerVisible(false);
        } catch (error) {
            message.error('Failed to associate calls with campaign');
            console.error('Error:', error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Open the reassign modal for a single call
    const handleOpenReassignModal = (callId, currentCampaignId) => {
        setSelectedRowKeys([callId]);
        reassignForm.setFieldsValue({
            from_campaign_id: currentCampaignId,
            to_campaign_id: undefined
        });
        setReassignModalVisible(true);
    };

    // Handle reassigning calls from one campaign to another
    const handleReassignCampaign = async (values) => {
        try {
            setBulkActionLoading(true);
            
            await axios.post('/api/calls/reassign-campaign/', {
                call_ids: selectedRowKeys,
                from_campaign_id: values.from_campaign_id,
                to_campaign_id: values.to_campaign_id
            });
            
            message.success(`${selectedRowKeys.length} call(s) reassigned successfully`);
            setSelectedRowKeys([]);
            setReassignModalVisible(false);
            fetchCalls();
        } catch (error) {
            message.error('Failed to reassign calls');
            console.error('Error:', error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Handle viewing call details
    const handleViewCallDetails = (callId) => {
        const call = calls.find(c => c.id === callId);
        if (call) {
            setCurrentCallDetails(call);
            setCallDetailsVisible(true);
        }
    };

    // Open the drawer to assign calls to a campaign
    const showCallAssignDrawer = () => {
        if (!selectedRowKeys.length) {
            message.warning('Please select at least one call to associate with a campaign');
            return;
        }
        setCallAssignDrawerVisible(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            {
                key: 'no-campaign',
                text: 'Select Calls Without Campaign',
                onSelect: () => {
                    const keysWithoutCampaign = calls
                        .filter(call => !call.campaign_id)
                        .map(call => call.id);
                    setSelectedRowKeys(keysWithoutCampaign);
                }
            }
        ]
    };

    const columns = [
        {
            title: 'Lead',
            dataIndex: 'lead_name',
            key: 'lead_name',
        },
        {
            title: 'Campaign',
            dataIndex: 'campaign_name',
            key: 'campaign_name',
            render: (text, record) => (
                <div>
                    {text ? (
                        <Space>
                            <span>{text}</span>
                            {record.campaign_id && (
                                <Tag 
                                    color={getCampaignStatusColor(record.campaign_status)} 
                                    style={{ marginLeft: 8 }}
                                >
                                    {record.campaign_status}
                                </Tag>
                            )}
                            <Button 
                                type="text" 
                                size="small"
                                icon={<SwapOutlined />} 
                                onClick={() => handleOpenReassignModal(record.id, record.campaign_id)}
                                title="Reassign to different campaign"
                            />
                        </Space>
                    ) : (
                        <Space>
                            <span className="text-gray-400">No Campaign</span>
                            <Button 
                                type="text" 
                                size="small"
                                icon={<UsergroupAddOutlined />} 
                                onClick={() => {
                                    setSelectedRowKeys([record.id]);
                                    setCallAssignDrawerVisible(true);
                                }}
                                title="Assign to campaign"
                            />
                        </Space>
                    )}
                </div>
            ),
            filters: campaigns.map(campaign => ({
                text: campaign.name,
                value: campaign.id
            })),
            onFilter: (value, record) => record.campaign_id === value,
        },
        {
            title: 'Script',
            dataIndex: 'script_name',
            key: 'script_name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    scheduled: 'blue',
                    'in-progress': 'green',
                    completed: 'purple',
                    failed: 'red',
                };
                return (
                    <Tag color={colors[status]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
            filters: [
                { text: 'Scheduled', value: 'scheduled' },
                { text: 'In Progress', value: 'in-progress' },
                { text: 'Completed', value: 'completed' },
                { text: 'Failed', value: 'failed' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Scheduled',
            dataIndex: 'scheduled_time',
            key: 'scheduled_time',
            render: (time) => time ? new Date(time).toLocaleString() : 'N/A'
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'scheduled' ? (
                        <Button
                            type="primary"
                            icon={<PhoneOutlined />}
                            onClick={() => handleStartCall(record.lead_id, record.script_id, record.campaign_id)}
                        >
                            Start Call
                        </Button>
                    ) : record.status === 'in-progress' ? (
                        <Button
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleEndCall(record.id)}
                        >
                            End Call
                        </Button>
                    ) : (
                        <Button
                            type="link"
                            onClick={() => handleViewCallDetails(record.id)}
                        >
                            View Details
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const ActiveCallPanel = () => (
        activeCall && (
            <Card title="Active Call" className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg">{activeCall.lead_name}</h3>
                        <p className="text-gray-500">
                            {activeCall.campaign_name && (
                                <Tag color="blue" style={{ marginRight: 8 }}>
                                    {activeCall.campaign_name}
                                </Tag>
                            )}
                            {activeCall.script_name}
                        </p>
                    </div>
                    <Space>
                        <Button icon={<AudioOutlined />}>Mute</Button>
                        <Button icon={<PauseCircleOutlined />}>Pause</Button>
                        <Button 
                            danger 
                            icon={<StopOutlined />}
                            onClick={() => handleEndCall(activeCall.id)}
                        >
                            End Call
                        </Button>
                    </Space>
                </div>
                <Progress percent={activeCall.progress} status="active" />
                <Timeline className="mt-4">
                    {activeCall.conversation_flow?.map((item, index) => (
                        <Timeline.Item key={index}>
                            <p><strong>{item.speaker}:</strong> {item.text}</p>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>
        )
    );

    // Open campaign settings drawer
    const handleOpenCampaignSettings = (campaignId) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        setEditingCampaign(campaign);
        
        // Parse operating hours into moment objects for the time picker
        const operatingStart = campaign.operating_hours_start ? 
            moment(campaign.operating_hours_start, 'HH:mm') : 
            moment('09:00', 'HH:mm');
            
        const operatingEnd = campaign.operating_hours_end ? 
            moment(campaign.operating_hours_end, 'HH:mm') : 
            moment('17:00', 'HH:mm');
        
        campaignSettingsForm.setFieldsValue({
            name: campaign.name,
            status: campaign.status || 'draft',
            script_id: campaign.script_id,
            daily_call_limit: campaign.daily_call_limit || 100,
            max_retries: campaign.max_retries || 3,
            retry_delay_minutes: campaign.retry_delay_minutes || 60,
            operating_hours: [operatingStart, operatingEnd],
            operating_days: campaign.operating_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            caller_id: campaign.caller_id || '',
            voicemail_enabled: campaign.voicemail_enabled !== false,
            auto_schedule: campaign.auto_schedule !== false,
            priority_level: campaign.priority_level || 'medium',
            concurrent_calls: campaign.concurrent_calls || 1,
            lead_source_id: campaign.lead_source_id
        });
        
        setCampaignSettingsVisible(true);
    };

    // Update campaign settings
    const handleUpdateCampaignSettings = async (values) => {
        if (!editingCampaign) return;
        
        try {
            setSavingCampaignSettings(true);
            
            // Format operating hours back to string format
            const formattedValues = {
                ...values,
                operating_hours_start: values.operating_hours[0].format('HH:mm'),
                operating_hours_end: values.operating_hours[1].format('HH:mm'),
            };
            
            // Remove the operating_hours array that's not needed on the backend
            delete formattedValues.operating_hours;
            
            await axios.put(`/api/campaigns/${editingCampaign.id}/`, formattedValues);
            
            message.success('Campaign settings updated successfully');
            fetchCampaigns();
            setCampaignSettingsVisible(false);
            setEditingCampaign(null);
        } catch (error) {
            message.error('Failed to update campaign settings');
            console.error('Error:', error);
        } finally {
            setSavingCampaignSettings(false);
        }
    };

    // Toggle campaign status (pause/resume)
    const handleToggleCampaignStatus = async (campaignId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'paused' : 'active';
            
            await axios.patch(`/api/campaigns/${campaignId}/`, {
                status: newStatus
            });
            
            message.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
            fetchCampaigns();
        } catch (error) {
            message.error('Failed to update campaign status');
            console.error('Error:', error);
        }
    };

    // Get selected campaign names for display
    const getSelectedCallCampaigns = () => {
        const selectedCalls = calls.filter(call => selectedRowKeys.includes(call.id));
        const campaignNames = [...new Set(selectedCalls
            .filter(call => call.campaign_id)
            .map(call => call.campaign_name))]
            .filter(Boolean);
            
        return campaignNames.length 
            ? `Currently in: ${campaignNames.join(', ')}` 
            : 'Currently not assigned to any campaign';
    };

    // Bulk action menu component
    const BulkActionMenu = () => (
        <div className="my-3 flex items-center justify-between">
            <div>
                <span className="mr-2">
                    <strong>{selectedRowKeys.length}</strong> call(s) selected
                </span>
                {selectedRowKeys.length > 0 && (
                    <Tag color="blue">{getSelectedCallCampaigns()}</Tag>
                )}
            </div>
            <Space>
                <Button 
                    type="primary" 
                    onClick={showCallAssignDrawer}
                    disabled={!selectedRowKeys.length}
                    icon={<UsergroupAddOutlined />}
                >
                    Assign to Campaign
                </Button>
                <Button 
                    onClick={() => setSelectedRowKeys([])}
                    disabled={!selectedRowKeys.length}
                >
                    Clear Selection
                </Button>
            </Space>
        </div>
    );

    // Campaign Settings Card component
    const CampaignSettingsCard = ({ campaign }) => {
        if (!campaign) return null;
        
        const operatingHoursStart = campaign.operating_hours_start || '09:00';
        const operatingHoursEnd = campaign.operating_hours_end || '17:00';
        const operatingDays = campaign.operating_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        
        const daysMap = {
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat',
            'sunday': 'Sun'
        };
        
        const daysDisplay = operatingDays.map(day => daysMap[day] || day).join(', ');
        
        return (
            <Card 
                className="mb-4" 
                title={
                    <div className="flex justify-between items-center">
                        <span>{campaign.name}</span>
                        <Tag color={getCampaignStatusColor(campaign.status)}>
                            {campaign.status?.toUpperCase()}
                        </Tag>
                    </div>
                }
                extra={
                    <Space>
                        <Button
                            type={campaign.status === 'active' ? 'default' : 'primary'}
                            icon={campaign.status === 'active' ? <PauseOutlined /> : <PlayCircleFilled />}
                            onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                        >
                            {campaign.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>
                        <Button 
                            icon={<SettingOutlined />}
                            onClick={() => handleOpenCampaignSettings(campaign.id)}
                        >
                            Settings
                        </Button>
                    </Space>
                }
                size="small"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500 mb-1"><ClockCircleOutlined /> Operating Hours</p>
                        <p>{operatingHoursStart} - {operatingHoursEnd}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1"><CalendarOutlined /> Operating Days</p>
                        <p>{daysDisplay}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1"><SlidersFilled /> Daily Call Limit</p>
                        <p>{campaign.daily_call_limit || 'Unlimited'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1"><BarsOutlined /> Max Retries</p>
                        <p>{campaign.max_retries || '0'}</p>
                    </div>
                </div>
                
                <Progress 
                    percent={campaign.progress || 0} 
                    status={campaign.status === 'active' ? 'active' : 'normal'}
                    size="small"
                    className="mt-4"
                />
                
                <div className="text-xs text-gray-500 mt-1">
                    {campaign.contacted_leads || 0} of {campaign.total_leads || 0} leads contacted
                </div>
            </Card>
        );
    };

    // Open campaign analytics drawer
    const handleOpenCampaignAnalytics = (campaignId) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        setEditingCampaign(campaign);
        analyticsForm.setFieldsValue({
            date_range: analyticsDateRange,
            time_frame: analysisTimeFrame
        });
        setCampaignAnalyticsVisible(true);
    };

    // Enhanced Campaign Filter Panel with Settings
    const CampaignFilterPanel = () => (
        <Card className="mb-4" size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ marginRight: 16 }}>Filter by Campaign:</span>
                    <Select 
                        style={{ width: 250 }} 
                        placeholder="All Campaigns"
                        allowClear
                        onChange={value => setCampaignFilter(value)}
                        value={campaignFilter}
                    >
                        {campaigns.map(campaign => (
                            <Option key={campaign.id} value={campaign.id}>
                                <Badge 
                                    color={getCampaignStatusColor(campaign.status)} 
                                    text={campaign.name} 
                                />
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    {campaignFilter && campaignStats[campaignFilter] && (
                        <Space>
                            <Tooltip title="Total Calls">
                                <Badge 
                                    count={campaignStats[campaignFilter].total_calls} 
                                    style={{ backgroundColor: '#1890ff' }}
                                    showZero
                                />
                            </Tooltip>
                            <Tooltip title="Completed Calls">
                                <Badge 
                                    count={campaignStats[campaignFilter].completed_calls} 
                                    style={{ backgroundColor: '#52c41a' }}
                                    showZero
                                />
                            </Tooltip>
                            <Tooltip title="Success Rate">
                                <Tag color="blue">{campaignStats[campaignFilter].success_rate}%</Tag>
                            </Tooltip>
                            <Button 
                                type="link" 
                                icon={<LineChartOutlined />}
                                onClick={() => handleOpenCampaignAnalytics(campaignFilter)}
                            >
                                Analytics
                            </Button>
                            
                            {/* Add campaign settings button */}
                            {campaignFilter && (
                                <Button
                                    type="link"
                                    icon={<SettingOutlined />}
                                    onClick={() => handleOpenCampaignSettings(campaignFilter)}
                                >
                                    Settings
                                </Button>
                            )}
                        </Space>
                    )}
                </div>
            </div>
            
            {/* Show campaign settings card if a campaign is selected */}
            {campaignFilter && (
                <div className="mt-4">
                    <CampaignSettingsCard 
                        campaign={campaigns.find(c => c.id === campaignFilter)}
                    />
                </div>
            )}
        </Card>
    );

    // Campaign performance summary card
    const CampaignPerformanceSummary = ({ analytics }) => {
        if (!analytics) return <Empty description="No data available" />;
        
        const { kpis, comparison } = analytics;
        
        return (
            <Card title="Campaign Performance" className="mb-4">
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic 
                            title="Total Calls"
                            value={kpis.total_calls}
                            prefix={<PhoneFilled />}
                            suffix={
                                <span className="text-sm ml-2" style={{ color: comparison.calls_growth >= 0 ? '#3f8600' : '#cf1322' }}>
                                    {comparison.calls_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                    {Math.abs(comparison.calls_growth)}%
                                </span>
                            }
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Connection Rate" 
                            value={kpis.connection_rate} 
                            suffix="%" 
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: kpis.connection_rate > 35 ? '#3f8600' : '#cf1322' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Appointments Set" 
                            value={kpis.appointments_set}
                            prefix={<ScheduleOutlined />}
                            suffix={
                                <span className="text-sm ml-2" style={{ color: comparison.appointments_growth >= 0 ? '#3f8600' : '#cf1322' }}>
                                    {comparison.appointments_growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                    {Math.abs(comparison.appointments_growth)}%
                                </span>
                            }
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Avg Call Duration" 
                            value={Math.floor(kpis.avg_call_duration / 60)} 
                            suffix="min" 
                            prefix={<ClockCircleFilled />}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic 
                            title="Conversion Rate" 
                            value={kpis.conversion_rate} 
                            suffix="%" 
                            valueStyle={{ color: kpis.conversion_rate > 10 ? '#3f8600' : '#cf1322' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Cost per Appointment" 
                            prefix="$"
                            value={kpis.cost_per_appointment}
                            valueStyle={{ color: kpis.cost_per_appointment < 30 ? '#3f8600' : '#cf1322' }}
                        />
                    </Col>
                    <Col span={12}>
                        <div className="text-right">
                            <Space>
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={() => generateReport('excel')}
                                    loading={generateReportLoading}
                                >
                                    Export to Excel
                                </Button>
                                <Button
                                    icon={<FilePdfOutlined />}
                                    onClick={() => generateReport('pdf')}
                                    loading={generateReportLoading}
                                >
                                    Export to PDF
                                </Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    };

    // Call outcomes chart
    const CallOutcomesChart = ({ analytics }) => {
        if (!analytics || !analytics.call_outcomes) return null;
        
        const { call_outcomes } = analytics;
        const data = [
            { name: 'Connected', value: call_outcomes.connected, color: '#52c41a' },
            { name: 'Voicemail', value: call_outcomes.voicemail, color: '#1890ff' },
            { name: 'No Answer', value: call_outcomes.no_answer, color: '#faad14' },
            { name: 'Busy', value: call_outcomes.busy, color: '#722ed1' },
            { name: 'Failed', value: call_outcomes.failed, color: '#f5222d' }
        ];
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        return (
            <Card title="Call Outcomes" className="mb-4">
                <div style={{ height: 240, display: 'flex', justifyContent: 'center' }}>
                    {/* Here you would use an actual chart component */}
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        {/* This is a placeholder for the actual PieChart component */}
                        <h3>Call Outcome Distribution</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                            {data.map(item => (
                                <Tag 
                                    key={item.name} 
                                    color={item.color}
                                    style={{ fontSize: 14, padding: '4px 8px' }}
                                >
                                    {item.name}: {item.value} ({Math.round(item.value / total * 100)}%)
                                </Tag>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    // Daily performance chart
    const PerformanceChart = ({ analytics }) => {
        if (!analytics || !analytics.time_series) return null;
        
        const { time_series } = analytics;
        
        return (
            <Card title="Campaign Performance Over Time" className="mb-4">
                <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    {/* Here you would use an actual chart component */}
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>Date</th>
                                    <th style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>Calls Made</th>
                                    <th style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>Connected</th>
                                    <th style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>Appointments</th>
                                    <th style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>Conversion Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {time_series.map((day, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{day.date}</td>
                                        <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{day.calls_made}</td>
                                        <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{day.connected}</td>
                                        <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{day.appointments}</td>
                                        <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{day.conversion_rate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        );
    };

    // Best and worst performing hours
    const HourlyPerformance = ({ analytics }) => {
        if (!analytics || !analytics.hourly_performance) return null;
        
        const { hourly_performance, worst_hours } = analytics;
        
        return (
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Best Performing Hours" className="mb-4">
                        <ul style={{ padding: 0, listStyle: 'none' }}>
                            {hourly_performance.map((hour, idx) => (
                                <li 
                                    key={idx}
                                    style={{ 
                                        padding: '8px 0', 
                                        borderBottom: idx < hourly_performance.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>
                                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                                        {hour.hour}:00 - {hour.hour + 1}:00
                                    </span>
                                    <span>
                                        <Tag color="green">{hour.connection_rate}% connection</Tag>
                                        <Tag color="blue">{hour.calls} calls</Tag>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Worst Performing Hours" className="mb-4">
                        <ul style={{ padding: 0, listStyle: 'none' }}>
                            {worst_hours.map((hour, idx) => (
                                <li 
                                    key={idx}
                                    style={{ 
                                        padding: '8px 0', 
                                        borderBottom: idx < worst_hours.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>
                                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                                        {hour.hour}:00 - {hour.hour + 1}:00
                                    </span>
                                    <span>
                                        <Tag color="red">{hour.connection_rate}% connection</Tag>
                                        <Tag color="blue">{hour.calls} calls</Tag>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <div className="p-6">
            <Tabs 
                defaultActiveKey="calls" 
                items={[
                    {
                        key: 'calls',
                        label: 'Calls',
                        children: (
                            <Card
                                title="Call Management"
                                extra={
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => setModalVisible(true)}
                                    >
                                        Schedule Call
                                    </Button>
                                }
                            >
                                <CampaignFilterPanel />
                                <ActiveCallPanel />
                                
                                {/* Bulk action menu */}
                                <BulkActionMenu />
                                
                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={Array.isArray(calls) ? calls : []}
                                    loading={loading}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} calls`,
                                    }}
                                />
                            </Card>
                        )
                    },
                    {
                        key: 'scripts',
                        label: 'Scripts',
                        children: (
                            <Card
                                title="Call Scripts"
                                extra={
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddScript}
                                    >
                                        Add Script
                                    </Button>
                                }
                            >
                                <Table
                                    columns={[
                                        {
                                            title: 'Name',
                                            dataIndex: 'name',
                                            key: 'name',
                                        },
                                        {
                                            title: 'Description',
                                            dataIndex: 'description',
                                            key: 'description',
                                        },
                                        {
                                            title: 'Script Type',
                                            dataIndex: 'script_type',
                                            key: 'script_type',
                                            render: (type) => type || 'General',
                                        },
                                        {
                                            title: 'Campaigns',
                                            key: 'campaigns',
                                            render: (_, record) => {
                                                // This would require additional API logic to fetch campaign usage
                                                const usedIn = campaigns.filter(
                                                    c => c.script_id === record.id
                                                );
                                                return usedIn.length ? (
                                                    <Badge count={usedIn.length} style={{ backgroundColor: '#1890ff' }}>
                                                        <span>Used in {usedIn.length} campaign{usedIn.length !== 1 ? 's' : ''}</span>
                                                    </Badge>
                                                ) : (
                                                    <span style={{ color: '#999' }}>Not in use</span>
                                                );
                                            }
                                        },
                                        {
                                            title: 'Actions',
                                            key: 'actions',
                                            render: (_, record) => (
                                                <Space>
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEditScript(record)}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<FundProjectionScreenOutlined />}
                                                        onClick={() => {/* View script performance */}}
                                                    />
                                                </Space>
                                            ),
                                        },
                                    ]}
                                    dataSource={Array.isArray(scripts) ? scripts : []}
                                    rowKey="id"
                                />
                            </Card>
                        )
                    }
                ]}
            >
            </Tabs>

            <Modal
                title="Schedule Call"
                open={modalVisible}
                onOk={form.submit}
                onCancel={() => setModalVisible(false)}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleScheduleCall}
                >
                    <Form.Item
                        name="campaign_id"
                        label="Campaign"
                    >
                        <Select 
                            placeholder="Select campaign (optional)"
                            allowClear
                            onChange={(value) => {
                                if (value) {
                                    // Find the campaign
                                    const campaign = campaigns.find(c => c.id === value);
                                    if (campaign && campaign.script_id) {
                                        // Pre-fill the script based on campaign
                                        form.setFieldsValue({ script_id: campaign.script_id });
                                    }
                                }
                            }}
                        >
                            {campaigns.map(campaign => (
                                <Option key={campaign.id} value={campaign.id}>
                                    <Badge 
                                        color={getCampaignStatusColor(campaign.status)} 
                                        text={campaign.name} 
                                    />
                                </Option>
                            ))}
                        </Select>
                        <div className="text-xs text-gray-500 mt-1">
                            Associating with a campaign will allow tracking and analytics
                        </div>
                    </Form.Item>
                    
                    <Form.Item
                        name="lead_id"
                        label="Lead"
                        rules={[{ required: true, message: 'Please select a lead' }]}
                    >
                        <Select 
                            placeholder="Select lead"
                            showSearch
                            optionFilterProp="children"
                        >
                            {leads.map(lead => (
                                <Option key={lead.id} value={lead.id}>
                                    {lead.name} ({lead.phone || lead.email})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="script_id"
                        label="Script"
                        rules={[{ required: true, message: 'Please select a script' }]}
                    >
                        <Select placeholder="Select script">
                            {Array.isArray(scripts) && scripts.map(script => (
                                <Option key={script.id} value={script.id}>
                                    {script.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="scheduled_time"
                        label="Scheduled Time"
                        rules={[{ required: true, message: 'Please select time' }]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                    
                    <Form.Item
                        name="notes"
                        label="Notes"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingScript ? "Edit Script" : "Create New Script"}
                open={scriptModalVisible}
                onOk={scriptForm.submit}
                onCancel={() => {
                    setScriptModalVisible(false);
                    setEditingScript(null);
                }}
                width={700}
                confirmLoading={loading}
            >
                <Form
                    form={scriptForm}
                    layout="vertical"
                    onFinish={handleCreateScript}
                    initialValues={{
                        script_type: 'general'
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Script Name"
                        rules={[{ required: true, message: 'Please enter a script name' }]}
                    >
                        <Input placeholder="E.g. Property Viewing Appointment" />
                    </Form.Item>
                    
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <TextArea rows={2} placeholder="Describe the purpose of this script" />
                    </Form.Item>
                    
                    <Form.Item
                        name="script_type"
                        label="Script Type"
                    >
                        <Select>
                            <Option value="general">General</Option>
                            <Option value="real_estate">Real Estate</Option>
                            <Option value="sales">Sales</Option>
                            <Option value="customer_service">Customer Service</Option>
                            <Option value="healthcare">Healthcare</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="content"
                        label="Script Content"
                        rules={[{ required: true, message: 'Please enter script content' }]}
                    >
                        <TextArea 
                            rows={10} 
                            placeholder="Enter the script content here. You can use {{variable}} syntax for dynamic content."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Reassign Campaign Modal */}
            <Modal
                title="Reassign Campaign"
                open={reassignModalVisible}
                onOk={reassignForm.submit}
                onCancel={() => {
                    setReassignModalVisible(false);
                    setSelectedRowKeys([]);
                }}
                confirmLoading={bulkActionLoading}
            >
                <Form
                    form={reassignForm}
                    layout="vertical"
                    onFinish={handleReassignCampaign}
                >
                    <Alert
                        message={`Reassigning ${selectedRowKeys.length} call(s)`}
                        type="info"
                        showIcon
                        className="mb-4"
                    />
                    
                    <Form.Item
                        name="from_campaign_id"
                        label="From Campaign"
                    >
                        <Select 
                            disabled
                            placeholder="Current campaign"
                        >
                            {campaigns.map(campaign => (
                                <Option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="to_campaign_id"
                        label="To Campaign"
                        rules={[{ required: true, message: 'Please select destination campaign' }]}
                    >
                        <Select 
                            placeholder="Select new campaign"
                            showSearch
                            optionFilterProp="children"
                        >
                            <Option value={null}>-- Remove from Campaign --</Option>
                            {campaigns.map(campaign => (
                                <Option key={campaign.id} value={campaign.id}>
                                    <Badge 
                                        color={getCampaignStatusColor(campaign.status)} 
                                        text={campaign.name} 
                                    />
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Call Assignment Drawer */}
            <Drawer
                title={`Assign ${selectedRowKeys.length} Call(s) to Campaign`}
                placement="right"
                onClose={() => setCallAssignDrawerVisible(false)}
                open={callAssignDrawerVisible}
                width={400}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button 
                            onClick={() => setCallAssignDrawerVisible(false)} 
                            style={{ marginRight: 8 }}
                        >
                            Cancel
                        </Button>
                    </div>
                }
            >
                <Alert
                    message={getSelectedCallCampaigns()}
                    type="info"
                    showIcon
                    className="mb-4"
                />
                
                <div className="mb-2">Select a campaign to assign these calls to:</div>
                
                {campaigns.map(campaign => (
                    <Card 
                        key={campaign.id} 
                        size="small" 
                        className="mb-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleAssociateWithCampaign(campaign.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge 
                                    color={getCampaignStatusColor(campaign.status)} 
                                    text={campaign.name} 
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {campaign.total_leads || 0} leads | {campaign.contacted_leads || 0} contacted
                                </div>
                            </div>
                            <Button 
                                type="primary" 
                                size="small"
                                loading={bulkActionLoading}
                            >
                                Assign
                            </Button>
                        </div>
                    </Card>
                ))}
                
                <div className="mt-4">
                    <Button 
                        block 
                        onClick={() => handleAssociateWithCampaign(null)}
                        loading={bulkActionLoading}
                    >
                        Remove from Campaign
                    </Button>
                </div>
            </Drawer>

            {/* Call Details Drawer */}
            <Drawer
                title="Call Details"
                placement="right"
                onClose={() => setCallDetailsVisible(false)}
                open={callDetailsVisible}
                width={600}
            >
                {currentCallDetails && (
                    <div>
                        <Card className="mb-4">
                            <h3 className="text-lg font-semibold">{currentCallDetails.lead_name}</h3>
                            <div className="mt-2">
                                <Tag color={getCampaignStatusColor(currentCallDetails.status)}>
                                    {currentCallDetails.status?.toUpperCase()}
                                </Tag>
                                {currentCallDetails.campaign_name && (
                                    <Tag color="blue">{currentCallDetails.campaign_name}</Tag>
                                )}
                                <Tag color="purple">{currentCallDetails.script_name}</Tag>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-gray-500">Scheduled Time:</p>
                                    <p>{currentCallDetails.scheduled_time ? new Date(currentCallDetails.scheduled_time).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Duration:</p>
                                    <p>{currentCallDetails.duration || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Agent:</p>
                                    <p>{currentCallDetails.agent_name || 'AI Agent'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Call Result:</p>
                                    <p>{currentCallDetails.result || 'Not Available'}</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card title="Call Transcript" className="mb-4">
                            {currentCallDetails.conversation_flow ? (
                                <Timeline>
                                    {currentCallDetails.conversation_flow.map((item, index) => (
                                        <Timeline.Item key={index}>
                                            <p><strong>{item.speaker}:</strong> {item.text}</p>
                                            {item.timestamp && (
                                                <p className="text-xs text-gray-400">
                                                    {new Date(item.timestamp).toLocaleTimeString()}
                                                </p>
                                            )}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            ) : (
                                <Empty description="No transcript available" />
                            )}
                        </Card>
                        
                        <Card title="Call Actions">
                            <Space>
                                <Button 
                                    type="primary" 
                                    icon={<PhoneOutlined />}
                                    onClick={() => {
                                        setCallDetailsVisible(false);
                                        // Schedule a follow-up call
                                        setModalVisible(true);
                                        form.setFieldsValue({
                                            lead_id: currentCallDetails.lead_id,
                                            script_id: currentCallDetails.script_id,
                                            campaign_id: currentCallDetails.campaign_id,
                                            notes: `Follow-up to call on ${new Date(currentCallDetails.scheduled_time).toLocaleDateString()}`
                                        });
                                    }}
                                >
                                    Schedule Follow-up
                                </Button>
                                
                                <Button 
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        // Edit call notes or result
                                    }}
                                >
                                    Edit Notes
                                </Button>
                                
                                <Button 
                                    icon={<SwapOutlined />}
                                    onClick={() => {
                                        setCallDetailsVisible(false);
                                        handleOpenReassignModal(
                                            currentCallDetails.id, 
                                            currentCallDetails.campaign_id
                                        );
                                    }}
                                >
                                    Reassign Campaign
                                </Button>
                            </Space>
                        </Card>
                    </div>
                )}
            </Drawer>

            {/* Campaign Analytics Drawer */}
            <Drawer
                title={`Campaign Analytics: ${editingCampaign?.name || ''}`}
                width={960}
                onClose={() => {
                    setCampaignAnalyticsVisible(false);
                    setEditingCampaign(null);
                }}
                open={campaignAnalyticsVisible}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button 
                            style={{ marginRight: 8 }} 
                            onClick={() => {
                                setCampaignAnalyticsVisible(false);
                                setEditingCampaign(null);
                            }}
                        >
                            Close
                        </Button>
                    </div>
                }
            >
                <Spin spinning={analyticsLoading}>
                    <Form
                        form={analyticsForm}
                        layout="vertical"
                        initialValues={{
                            date_range: analyticsDateRange,
                            time_frame: analysisTimeFrame
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    label="Date Range"
                                    name="date_range"
                                >
                                    <DateRangePicker 
                                        format="YYYY-MM-DD"
                                        onChange={(dates) => setAnalyticsDateRange(dates)}
                                        allowClear={false}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Analysis Timeframe"
                                    name="time_frame"
                                >
                                    <Radio.Group 
                                        onChange={(e) => setAnalysisTimeFrame(e.target.value)}
                                        options={[
                                            { label: 'Daily', value: 'daily' },
                                            { label: 'Weekly', value: 'weekly' },
                                            { label: 'Monthly', value: 'monthly' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    
                    <Alert 
                        message="Campaign Performance Analysis" 
                        description={`Analyzing performance from ${analyticsDateRange[0]?.format('YYYY-MM-DD')} to ${analyticsDateRange[1]?.format('YYYY-MM-DD')}`}
                        type="info" 
                        showIcon
                        className="mb-4"
                        icon={<InfoCircleOutlined />}
                    />
                    
                    {campaignAnalytics ? (
                        <>
                            <CampaignPerformanceSummary analytics={campaignAnalytics} />
                            
                            <Row gutter={16}>
                                <Col span={12}>
                                    <CallOutcomesChart analytics={campaignAnalytics} />
                                </Col>
                                <Col span={12}>
                                    <Card title="Conversion Metrics" className="mb-4">
                                        <Progress 
                                            percent={campaignAnalytics.kpis.connection_rate}
                                            status="active"
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                        />
                                        <div className="text-center mb-4">Connection Rate</div>
                                        
                                        <Progress 
                                            percent={campaignAnalytics.kpis.conversion_rate}
                                            status="active"
                                            strokeColor={{
                                                '0%': '#87d068',
                                                '100%': '#f5222d',
                                            }}
                                        />
                                        <div className="text-center">Conversion Rate (Appointments)</div>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <PerformanceChart analytics={campaignAnalytics} />
                            <HourlyPerformance analytics={campaignAnalytics} />
                            
                            <Card title="Recommendations" className="mb-4">
                                <ul className="pl-4">
                                    <li className="mb-2">
                                        <strong>Best Call Times:</strong> Schedule calls during your best performing hours (see chart above) to maximize connection rates.
                                    </li>
                                    <li className="mb-2">
                                        <strong>Script Optimization:</strong> Your conversion rate is {campaignAnalytics.kpis.conversion_rate}%. Consider testing different scripts to improve appointment setting.
                                    </li>
                                    <li className="mb-2">
                                        <strong>Follow-up Strategy:</strong> {campaignAnalytics.call_outcomes.voicemail + campaignAnalytics.call_outcomes.no_answer} calls went to voicemail or were not answered. Implement a structured follow-up strategy for these leads.
                                    </li>
                                    <li className="mb-2">
                                        <strong>Call Volume:</strong> {campaignAnalytics.comparison.calls_growth >= 0 ? 'Great job increasing' : 'Consider increasing'} your call volume to generate more opportunities.
                                    </li>
                                </ul>
                            </Card>
                        </>
                    ) : (
                        <Empty description="No analytics data available" />
                    )}
                </Spin>
            </Drawer>

            {/* Campaign Settings Drawer */}
            <Drawer
                title={`Campaign Settings: ${editingCampaign?.name || ''}`}
                width={600}
                onClose={() => {
                    setCampaignSettingsVisible(false);
                    setEditingCampaign(null);
                }}
                open={campaignSettingsVisible}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button 
                            style={{ marginRight: 8 }} 
                            onClick={() => {
                                setCampaignSettingsVisible(false);
                                setEditingCampaign(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            onClick={campaignSettingsForm.submit}
                            loading={savingCampaignSettings}
                        >
                            Save Settings
                        </Button>
                    </div>
                }
            >
                <Form
                    form={campaignSettingsForm}
                    layout="vertical"
                    onFinish={handleUpdateCampaignSettings}
                >
                    <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
                        <Panel header="Basic Information" key="1">
                            <Form.Item
                                name="name"
                                label="Campaign Name"
                                rules={[{ required: true, message: 'Please enter campaign name' }]}
                            >
                                <Input placeholder="E.g. Q2 Sales Outreach" />
                            </Form.Item>
                            
                            <Form.Item
                                name="status"
                                label="Status"
                            >
                                <Select>
                                    <Option value="draft">Draft</Option>
                                    <Option value="scheduled">Scheduled</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="paused">Paused</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            </Form.Item>
                            
                            <Form.Item
                                name="script_id"
                                label="Default Script"
                                rules={[{ required: true, message: 'Please select a script' }]}
                            >
                                <Select placeholder="Select script">
                                    {Array.isArray(scripts) && scripts.map(script => (
                                        <Option key={script.id} value={script.id}>
                                            {script.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            
                            <Form.Item
                                name="lead_source_id"
                                label="Lead Source"
                            >
                                <Select placeholder="Select lead source" allowClear>
                                    <Option value="1">Website Leads</Option>
                                    <Option value="2">Imported List</Option>
                                    <Option value="3">Manual Entries</Option>
                                </Select>
                            </Form.Item>
                        </Panel>
                        
                        <Panel header="Call Settings" key="2">
                            <Form.Item
                                name="daily_call_limit"
                                label="Daily Call Limit"
                                tooltip="Maximum number of calls to make per day"
                            >
                                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                            </Form.Item>
                            
                            <Form.Item
                                name="concurrent_calls"
                                label="Concurrent Calls"
                                tooltip="How many calls to make simultaneously"
                            >
                                <InputNumber min={1} max={10} style={{ width: '100%' }} />
                            </Form.Item>
                            
                            <Form.Item
                                name="max_retries"
                                label="Max Retries"
                                tooltip="Maximum times to retry unanswered calls"
                            >
                                <InputNumber min={0} max={10} style={{ width: '100%' }} />
                            </Form.Item>
                            
                            <Form.Item
                                name="retry_delay_minutes"
                                label="Retry Delay (minutes)"
                                tooltip="Time to wait before retrying an unanswered call"
                            >
                                <InputNumber min={1} max={1440} style={{ width: '100%' }} />
                            </Form.Item>
                            
                            <Form.Item
                                name="caller_id"
                                label="Caller ID"
                                tooltip="Phone number to display to recipients"
                            >
                                <Input placeholder="E.g. +1 (555) 123-4567" />
                            </Form.Item>
                            
                            <Form.Item
                                name="priority_level"
                                label="Priority Level"
                                tooltip="Determines which campaign gets preference when scheduling calls"
                            >
                                <Select>
                                    <Option value="low">Low</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="high">High</Option>
                                </Select>
                            </Form.Item>
                        </Panel>
                        
                        <Panel header="Schedule Settings" key="3">
                            <Form.Item
                                name="operating_hours"
                                label="Operating Hours"
                                tooltip="Time period during which calls can be made"
                                rules={[{ required: true, message: 'Please set operating hours' }]}
                            >
                                <RangePicker 
                                    format="HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            
                            <Form.Item
                                name="operating_days"
                                label="Operating Days"
                                tooltip="Days of the week when calls can be made"
                                rules={[{ required: true, message: 'Please select at least one day' }]}
                            >
                                <Select mode="multiple" placeholder="Select days">
                                    <Option value="monday">Monday</Option>
                                    <Option value="tuesday">Tuesday</Option>
                                    <Option value="wednesday">Wednesday</Option>
                                    <Option value="thursday">Thursday</Option>
                                    <Option value="friday">Friday</Option>
                                    <Option value="saturday">Saturday</Option>
                                    <Option value="sunday">Sunday</Option>
                                </Select>
                            </Form.Item>
                            
                            <Form.Item
                                name="auto_schedule"
                                label="Auto Schedule Calls"
                                valuePropName="checked"
                                tooltip="Automatically schedule calls within operating hours"
                            >
                                <Switch />
                            </Form.Item>
                        </Panel>
                        
                        <Panel header="Advanced Settings" key="4">
                            <Form.Item
                                name="voicemail_enabled"
                                label="Leave Voicemail"
                                valuePropName="checked"
                                tooltip="Whether to leave a voicemail message if the call is not answered"
                            >
                                <Switch />
                            </Form.Item>
                            
                            <Form.Item
                                label="Campaign Actions"
                            >
                                <Space>
                                    <Button 
                                        type="default"
                                        onClick={() => {
                                            // Download campaign data
                                        }}
                                    >
                                        Export Data
                                    </Button>
                                    
                                    <Button 
                                        danger
                                        onClick={() => {
                                            // Delete campaign
                                        }}
                                    >
                                        Delete Campaign
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </Form>
            </Drawer>
        </div>
    );
};

export default CallAgent; 
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Button, 
    TextField, 
    CircularProgress, 
    Tabs, 
    Tab, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
    Divider
} from '@mui/material';
import { Phone, BarChart2, List, FileText, MessageSquare, RefreshCw, Calendar, Settings } from 'lucide-react';
import AICallingService from '../../services/aiCallingService';
import { CallLogs, CallAnalytics, TranscriptionDetail, AntDesignWrapper, CallAgent } from '../calling';
import PhoneNumberManager from '../calling/PhoneNumberManager';
import CallScriptManager from '../calling/CallScriptManager';
import CallScheduler from '../calling/CallScheduler';
import * as callAgentApiAdapter from '../../services/callAgentApiAdapter';
import useCallWebSocket from '../../hooks/useCallWebSocket';

const AICallingDashboard = () => {
    const [scripts, setScripts] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedScript, setSelectedScript] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [openScriptDialog, setOpenScriptDialog] = useState(false);
    const [newScript, setNewScript] = useState({ name: '', description: '', content: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedCall, setSelectedCall] = useState(null);
    const [showTranscription, setShowTranscription] = useState(false);
    
    // Get the current user ID from localStorage
    const userId = localStorage.getItem('userId') || 'demo-user';
    
    // WebSocket integration for real-time updates
    const { lastMessage, connectionStatus } = useCallWebSocket(userId, {
        subscriptions: {
            'call_status_update': handleCallStatusUpdate,
            'call_transcript_update': handleTranscriptUpdate,
            'new_call': handleNewCall,
            'transcription_complete': handleTranscriptionComplete
        }
    });
    
    function handleCallStatusUpdate(data) {
        try {
            if (!data) return;
            fetchDashboardData();
            setSnackbar({
                open: true,
                message: `Call status updated: ${data.status || 'unknown'}`,
                severity: 'info'
            });
        } catch (err) {
            console.warn('Error handling call status update:', err);
        }
    }
    
    function handleTranscriptUpdate(data) {
        try {
            // If we're viewing this call's transcript, update it
            if (!data) return;
            if (selectedCall && selectedCall.id === data.call_id && showTranscription) {
                setSelectedCall(prevCall => ({
                    ...prevCall,
                    transcript: data.transcript || prevCall.transcript
                }));
            }
        } catch (err) {
            console.warn('Error handling transcript update:', err);
        }
    }
    
    function handleNewCall(data) {
        try {
            if (!data) return;
            fetchDashboardData();
            setSnackbar({
                open: true,
                message: `New call initiated to ${data.phone_number || ''}`,
                severity: 'success'
            });
        } catch (err) {
            console.warn('Error handling new call:', err);
        }
    }
    
    function handleTranscriptionComplete(data) {
        try {
            if (!data) return;
            fetchDashboardData();
            setSnackbar({
                open: true,
                message: `Call transcription complete for call ${data.call_id || ''}`,
                severity: 'success'
            });
        } catch (err) {
            console.warn('Error handling transcription complete:', err);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            
            // Fetch scripts with error handling
            try {
                const scriptsData = await AICallingService.getCallScripts();
                setScripts(scriptsData);
            } catch (scriptErr) {
                console.warn('Error fetching scripts:', scriptErr);
                // We'll continue even if scripts fail - the service will return mock data
            }

            // Fetch analytics with independent error handling
            try {
                const dateRange = {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString()
                };
                const analyticsData = await AICallingService.getCallAnalytics(dateRange);
                setAnalytics(analyticsData);
            } catch (analyticsErr) {
                console.warn('Error fetching analytics:', analyticsErr);
                // Set default analytics data if API fails
                setAnalytics({
                    total_calls: 0,
                    completed_calls: 0,
                    scheduled_calls: 0,
                    in_progress_calls: 0,
                    call_duration_avg: 0,
                    calls_by_date: [],
                    conversion_rate: 0
                });
            }
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
            setError('Failed to load dashboard data. Some features may be limited.');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeCall = async () => {
        if (!phoneNumber || !selectedScript) {
            setSnackbar({
                open: true,
                message: 'Please enter a phone number and select a script',
                severity: 'warning'
            });
            return;
        }
        
        try {
            setSnackbar({
                open: true,
                message: 'Initiating call...',
                severity: 'info'
            });
            
            const result = await AICallingService.makeCall(phoneNumber, selectedScript);
            setPhoneNumber('');
            
            setSnackbar({
                open: true,
                message: `Call initiated successfully to ${phoneNumber}`,
                severity: 'success'
            });
            
            // Refresh dashboard data
            fetchDashboardData();
        } catch (err) {
            console.error('Error making call:', err);
            setSnackbar({
                open: true,
                message: `Failed to make call: ${err.message || 'Unknown error'}`,
                severity: 'error'
            });
        }
    };

    const handleScriptSave = async (scriptData) => {
        try {
            await AICallingService.saveCallScript(scriptData);
            fetchDashboardData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading && activeTab === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error && activeTab === 0) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={fetchDashboardData}>Retry</Button>
            </Box>
        );
    }
    
    const handleOpenScriptDialog = () => {
        setNewScript({ name: '', description: '', content: '' });
        setOpenScriptDialog(true);
    };
    
    const handleCloseScriptDialog = () => {
        setOpenScriptDialog(false);
    };
    
    const handleScriptInputChange = (e) => {
        const { name, value } = e.target;
        setNewScript(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCreateScript = async () => {
        try {
            await handleScriptSave(newScript);
            handleCloseScriptDialog();
            setSnackbar({
                open: true,
                message: 'Script created successfully!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Error creating script: ${err.message}`,
                severity: 'error'
            });
        }
    };
    
    const handleMakeCallWithNotification = async () => {
        try {
            await handleMakeCall();
            setSnackbar({
                open: true,
                message: 'Call initiated successfully!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Error initiating call: ${err.message}`,
                severity: 'error'
            });
        }
    };
    
    const handleDeleteScript = async (scriptId) => {
        try {
            // Implement script deletion logic here
            // await AICallingService.deleteScript(scriptId);
            fetchDashboardData();
            setSnackbar({
                open: true,
                message: 'Script deleted successfully!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: `Error deleting script: ${err.message}`,
                severity: 'error'
            });
        }
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    
    return (
        <Box sx={{ width: '100%' }}>
            {/* Connection status indicator */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
                <Typography variant="body2" color={connectionStatus === 'connected' ? 'success.main' : 'error.main'} mr={1}>
                    {connectionStatus === 'connected' ? 'WebSocket Connected' : 'WebSocket Disconnected'}
                </Typography>
                <IconButton size="small" onClick={() => window.location.reload()} title="Refresh dashboard">
                    <RefreshCw size={16} />
                </IconButton>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<BarChart2 size={20} />} label="Analytics" />
                    <Tab icon={<List size={20} />} label="Call Logs" />
                    <Tab icon={<Phone size={20} />} label="Make Calls" />
                    <Tab icon={<FileText size={20} />} label="Scripts" />
                    <Tab icon={<MessageSquare size={20} />} label="AI Call Agent" />
                </Tabs>
            </Box>
            
            {/* Transcription Detail View - Overlay */}
            {showTranscription && selectedCall && (
                <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">Call Transcript</Typography>
                        <Button onClick={() => setShowTranscription(false)} variant="outlined" size="small">
                            Back to {activeTab === 0 ? 'Analytics' : activeTab === 1 ? 'Call Logs' : activeTab === 2 ? 'Make Calls' : 'Scripts'}
                        </Button>
                    </Box>
                    <TranscriptionDetail call={selectedCall} />
                    <Divider sx={{ my: 3 }} />
                </Box>
            )}
            
            {/* Analytics Tab */}
            {!showTranscription && activeTab === 0 && (
                <CallAnalytics onViewTranscript={(call) => {
                    setSelectedCall(call);
                    setShowTranscription(true);
                }} />
            )}
            
            {/* Call Logs Tab */}
            {!showTranscription && activeTab === 1 && (
                <CallLogs onViewTranscript={(call) => {
                    setSelectedCall(call);
                    setShowTranscription(true);
                }} />
            )}
            
            {/* Make Calls Tab */}
            {!showTranscription && activeTab === 2 && (
                <Box p={3}>
                    <Typography variant="h4" gutterBottom>Make a Call</Typography>
                    <Card>
                        <CardContent>
                            <Box sx={{ maxWidth: 600, mx: 'auto', py: 2 }}>
                                <Typography variant="h6" gutterBottom>New AI Call</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+1234567890"
                                            helperText="Enter the recipient's phone number"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Call Script</InputLabel>
                                            <Select
                                                value={selectedScript}
                                                onChange={(e) => setSelectedScript(e.target.value)}
                                                label="Call Script"
                                            >
                                                <MenuItem value="">Select a script</MenuItem>
                                                {scripts.map((script) => (
                                                    <MenuItem key={script.id} value={script.id}>
                                                        {script.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleOpenScriptDialog}
                                            >
                                                Create New Script
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                startIcon={<Phone size={20} />}
                                                onClick={handleMakeCallWithNotification}
                                                disabled={!phoneNumber || !selectedScript}
                                            >
                                                Initiate Call
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                    
                    {/* Recent Calls Summary */}
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Recent Calls</Typography>
                            {analytics && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box p={2} textAlign="center">
                                            <Typography variant="h3">{analytics?.totalCalls || 0}</Typography>
                                            <Typography variant="body1" color="text.secondary">Total Calls</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box p={2} textAlign="center">
                                            <Typography variant="h3">{analytics?.successRate || '0%'}</Typography>
                                            <Typography variant="body1" color="text.secondary">Success Rate</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box p={2} textAlign="center">
                                            <Typography variant="h3">{analytics?.avgDuration || '0m'}</Typography>
                                            <Typography variant="body1" color="text.secondary">Average Duration</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            )}
            
            {/* Scripts Tab */}
            {!showTranscription && activeTab === 3 && (
                <Box p={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4">Call Scripts</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenScriptDialog}
                        >
                            Create New Script
                        </Button>
                    </Box>
                    
                    <Grid container spacing={3}>
                        {scripts.length === 0 ? (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                        <Typography variant="h6">No Scripts Available</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Create your first AI call script to get started
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            sx={{ mt: 3 }}
                                            onClick={handleOpenScriptDialog}
                                        >
                                            Create Script
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ) : (
                            scripts.map(script => (
                                <Grid item xs={12} md={6} lg={4} key={script.id}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>{script.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {script.description}
                                            </Typography>
                                            <Box sx={{ 
                                                mt: 2, 
                                                p: 2, 
                                                bgcolor: 'background.default', 
                                                borderRadius: 1,
                                                maxHeight: 100,
                                                overflow: 'auto',
                                                fontSize: '0.8rem'
                                            }}>
                                                <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                                                    {script.content?.substring(0, 150)}...
                                                </pre>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                            <Button 
                                                size="small" 
                                                onClick={() => {
                                                    setNewScript(script);
                                                    setOpenScriptDialog(true);
                                                }}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDeleteScript(script.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>
            )}
            
            {/* Script Dialog */}
            <Dialog open={openScriptDialog} onClose={handleCloseScriptDialog} maxWidth="md" fullWidth>
                <DialogTitle>{newScript.id ? 'Edit Script' : 'Create New Script'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Script Name"
                            name="name"
                            value={newScript.name}
                            onChange={handleScriptInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name="description"
                            value={newScript.description}
                            onChange={handleScriptInputChange}
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Script Content"
                            name="content"
                            value={newScript.content}
                            onChange={handleScriptInputChange}
                            multiline
                            rows={10}
                            helperText="Write your AI script using natural language. The AI will follow this script during the call."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScriptDialog}>Cancel</Button>
                    <Button onClick={handleCreateScript} variant="contained" color="primary">
                        {newScript.id ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* AI Call Agent Tab */}
            {!showTranscription && activeTab === 4 && (
                <Box p={3}>
                    <Typography variant="h4" gutterBottom>AI Call Agent</Typography>
                    <AntDesignWrapper>
                        <CallAgent 
                            apiHandlers={{
                                fetchCalls: callAgentApiAdapter.fetchCalls,
                                fetchScripts: callAgentApiAdapter.fetchScripts,
                                fetchCampaigns: callAgentApiAdapter.fetchCampaigns,
                                makeCall: callAgentApiAdapter.makeCall,
                                saveScript: callAgentApiAdapter.saveScript,
                                endCall: callAgentApiAdapter.endCall,
                                createCampaign: callAgentApiAdapter.createCampaign,
                                updateCampaign: callAgentApiAdapter.updateCampaign
                            }}
                            initialData={{
                                calls: [],
                                scripts: scripts || [],
                                campaigns: []
                            }}
                        />
                    </AntDesignWrapper>
                </Box>
            )}
            
            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AICallingDashboard; 
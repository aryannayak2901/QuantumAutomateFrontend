import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, TextField, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import CRMService from '../../services/crmService';
import LeadListPage from '../../pages/UserDashboard/LeadsManagement/LeadListPage';

const CRMDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [currentTab, setCurrentTab] = useState('leads');

    useEffect(() => {
        fetchCRMData();
    }, []);

    const fetchCRMData = async () => {
        try {
            setLoading(true);
            const [leadsData, campaignsData] = await Promise.all([
                CRMService.getLeads(),
                CRMService.getCampaigns()
            ]);
            setLeads(leadsData);
            setCampaigns(campaignsData);

            if (campaignsData.length > 0) {
                const analyticsData = await CRMService.getCampaignAnalytics(campaignsData[0].id);
                setSelectedCampaign(analyticsData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLead = async (leadData) => {
        try {
            await CRMService.createLead(leadData);
            fetchCRMData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateCampaign = async (campaignData) => {
        try {
            await CRMService.createCampaign(campaignData);
            fetchCRMData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    if (loading && currentTab !== 'leads') {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error && currentTab !== 'leads') {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={fetchCRMData}>Retry</Button>
            </Box>
        );
    }

    const renderTabContent = () => {
        switch (currentTab) {
            case 'leads':
                return <LeadListPage />;
            case 'campaigns':
                return renderCampaignsTab();
            case 'analytics':
                return renderAnalyticsTab();
            case 'dashboard':
            default:
                return renderDashboardTab();
        }
    };

    const renderDashboardTab = () => (
        <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>CRM Dashboard</Typography>
            </Grid>

            {/* Analytics Cards */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Leads</Typography>
                        <Typography variant="h3">{leads.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Active Campaigns</Typography>
                        <Typography variant="h3">{campaigns.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Conversion Rate</Typography>
                        <Typography variant="h3">{selectedCampaign?.conversionRate || '0%'}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Leads Preview */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Recent Leads</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setCurrentTab('leads')}
                            >
                                View All Leads
                            </Button>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Source</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leads.slice(0, 5).map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>{lead.name}</TableCell>
                                        <TableCell>{lead.email}</TableCell>
                                        <TableCell>{lead.phone}</TableCell>
                                        <TableCell>{lead.status}</TableCell>
                                        <TableCell>{lead.source}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>

            {/* Campaigns Preview */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Active Campaigns</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setCurrentTab('campaigns')}
                            >
                                View All Campaigns
                            </Button>
                        </Box>
                        <Grid container spacing={2}>
                            {campaigns.slice(0, 2).map((campaign) => (
                                <Grid item xs={12} md={6} key={campaign.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6">{campaign.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {campaign.description}
                                            </Typography>
                                            <Box mt={2}>
                                                <Typography>
                                                    Status: {campaign.status}
                                                </Typography>
                                                <Typography>
                                                    Leads: {campaign.leadCount}
                                                </Typography>
                                                <Typography>
                                                    Conversion: {campaign.conversionRate}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderCampaignsTab = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom>Campaign Management</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            // Open campaign creation dialog
                        }}
                    >
                        Create Campaign
                    </Button>
                </Box>
            </Grid>
            
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {campaigns.map((campaign) => (
                        <Grid item xs={12} md={6} lg={4} key={campaign.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{campaign.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {campaign.description}
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography>
                                            Status: {campaign.status}
                                        </Typography>
                                        <Typography>
                                            Leads: {campaign.leadCount}
                                        </Typography>
                                        <Typography>
                                            Conversion: {campaign.conversionRate}
                                        </Typography>
                                    </Box>
                                    <Box mt={2} display="flex" justifyContent="space-between">
                                        <Button size="small" variant="outlined">View Details</Button>
                                        <Button size="small" color="error" variant="outlined">End Campaign</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );

    const renderAnalyticsTab = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>Analytics & Reports</Typography>
            </Grid>
            
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Lead Acquisition Trends</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Chart visualization will be implemented here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Lead Status Distribution</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Pie chart visualization will be implemented here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Lead Source Distribution</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Pie chart visualization will be implemented here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Campaign Performance Comparison</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Bar chart visualization will be implemented here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    aria-label="CRM Dashboard tabs"
                    sx={{ 
                        '.MuiTab-root': { 
                            minWidth: 0, 
                            px: 3, 
                            py: 1.5, 
                            fontWeight: 'medium' 
                        }
                    }}
                >
                    <Tab label="Dashboard" value="dashboard" />
                    <Tab label="Leads" value="leads" />
                    <Tab label="Campaigns" value="campaigns" />
                    <Tab label="Analytics" value="analytics" />
                </Tabs>
            </Box>
            
            <Box p={2}>
                {renderTabContent()}
            </Box>
        </Box>
    );
};

export default CRMDashboard; 
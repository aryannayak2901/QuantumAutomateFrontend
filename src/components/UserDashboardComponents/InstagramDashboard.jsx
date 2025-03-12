import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, CircularProgress } from '@mui/material';
import InstagramService from '../../services/instagramService';

const InstagramDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [comments, setComments] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInstagramData();
    }, []);

    const fetchInstagramData = async () => {
        try {
            setLoading(true);
            const accountsData = await InstagramService.getConnectedAccounts();
            setAccounts(accountsData);

            if (accountsData.length > 0) {
                const dateRange = {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString()
                };
                const analyticsData = await InstagramService.getLeadAnalytics(accountsData[0].id, dateRange);
                setAnalytics(analyticsData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectAccount = async () => {
        // Implement Instagram OAuth flow
        window.location.href = '/api/instagram/auth';
    };

    const handleSendDM = async (userId, message) => {
        try {
            await InstagramService.sendAutomatedDM(userId, message);
            // Update UI or show success message
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={fetchInstagramData}>Retry</Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* Header Section */}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4">Instagram Dashboard</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConnectAccount}
                        >
                            Connect Instagram Account
                        </Button>
                    </Box>
                </Grid>

                {/* Analytics Cards */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Leads</Typography>
                            <Typography variant="h3">{analytics?.totalLeads || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Engagement Rate</Typography>
                            <Typography variant="h3">{analytics?.engagementRate || '0%'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Conversion Rate</Typography>
                            <Typography variant="h3">{analytics?.conversionRate || '0%'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Connected Accounts */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Connected Accounts</Typography>
                            {accounts.length === 0 ? (
                                <Typography>No accounts connected</Typography>
                            ) : (
                                accounts.map(account => (
                                    <Box key={account.id} mb={2} display="flex" alignItems="center">
                                        <img 
                                            src={account.profilePicture} 
                                            alt={account.username}
                                            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 16 }}
                                        />
                                        <Typography>{account.username}</Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Comments */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Recent Comments</Typography>
                            {comments.length === 0 ? (
                                <Typography>No recent comments</Typography>
                            ) : (
                                comments.map(comment => (
                                    <Box key={comment.id} mb={2} p={2} bgcolor="background.paper">
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.username}
                                        </Typography>
                                        <Typography>{comment.text}</Typography>
                                        <Button
                                            size="small"
                                            onClick={() => handleSendDM(comment.userId, 'Thank you for your comment!')}
                                        >
                                            Send DM
                                        </Button>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InstagramDashboard; 
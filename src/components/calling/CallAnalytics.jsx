import React, { useState, useEffect } from 'react';
import useCallWebSocket from '../../hooks/useCallWebSocket';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { DatePicker, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AICallingService from '../../services/aiCallingService';

const CallAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [timeFrame, setTimeFrame] = useState('weekly'); // daily, weekly, monthly
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const { lastMessage } = useCallWebSocket('current-user-id', {
    subscriptions: {
      'analytics_update': handleAnalyticsUpdate
    }
  });

  function handleAnalyticsUpdate(data) {
    // Update specific analytics metrics without a full refresh
    if (data.metrics) {
      setAnalytics(prevAnalytics => {
        if (!prevAnalytics) return prevAnalytics;
        
        return {
          ...prevAnalytics,
          ...data.metrics
        };
      });
    }
  }
  
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, timeFrame]);
  
  // Refresh analytics data when calls are completed or other significant events occur
  useEffect(() => {
    if (lastMessage && ['call_completed', 'transcription_complete', 'insights_generated'].includes(lastMessage.type)) {
      fetchAnalytics();
    }
  }, [lastMessage]);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await AICallingService.getCallAnalytics({
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
        timeFrame
      });
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch call analytics');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };
  
  const calculatePercentageChange = (current, previous) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };
  
  const StatCard = ({ title, value, percentChange, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {percentChange !== null && (
              <Typography 
                variant="body2" 
                color={parseFloat(percentChange) >= 0 ? 'success.main' : 'error.main'}
              >
                {parseFloat(percentChange) >= 0 ? '+' : ''}{percentChange}% vs previous period
              </Typography>
            )}
          </Box>
          <Box color="primary.main">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  
  if (loading && !analytics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && !analytics) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchAnalytics} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }
  
  // If we're still loading but have previous data, show the data with a loading indicator
  const isRefreshing = loading && analytics;
  
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Call Analytics</Typography>
        
        {isRefreshing && (
          <CircularProgress size={24} sx={{ ml: 2 }} />
        )}
        
        <Stack direction="row" spacing={2}>
          <Space>
            <DatePicker
              placeholder="Start Date"
              value={dateRange.startDate ? new Date(dateRange.startDate) : null}
              onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date ? date.toDate() : null }))}
              style={{ marginRight: '8px' }}
            />
            
            <DatePicker
              placeholder="End Date"
              value={dateRange.endDate ? new Date(dateRange.endDate) : null}
              onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date ? date.toDate() : null }))}
              style={{ marginRight: '8px' }}
            />
          </Space>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Frame</InputLabel>
            <Select
              value={timeFrame}
              onChange={handleTimeFrameChange}
              label="Time Frame"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      
      {analytics && (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Calls" 
                value={analytics.totalCalls.current} 
                percentChange={calculatePercentageChange(
                  analytics.totalCalls.current,
                  analytics.totalCalls.previous
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Average Duration" 
                value={`${Math.floor(analytics.avgDuration.current / 60)}:${(analytics.avgDuration.current % 60).toString().padStart(2, '0')}`} 
                percentChange={calculatePercentageChange(
                  analytics.avgDuration.current,
                  analytics.avgDuration.previous
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Success Rate" 
                value={`${(analytics.successRate.current * 100).toFixed(1)}%`}
                percentChange={calculatePercentageChange(
                  analytics.successRate.current * 100,
                  analytics.successRate.previous * 100
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="AI Response Quality" 
                value={`${(analytics.aiQualityScore.current * 10).toFixed(1)}/10`}
                percentChange={calculatePercentageChange(
                  analytics.aiQualityScore.current * 10,
                  analytics.aiQualityScore.previous * 10
                )}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Call Volume
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.callVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inbound" stackId="a" fill="#8884d8" name="Inbound Calls" />
                      <Bar dataKey="outbound" stackId="a" fill="#82ca9d" name="Outbound Calls" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Call Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} calls`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default CallAnalytics;

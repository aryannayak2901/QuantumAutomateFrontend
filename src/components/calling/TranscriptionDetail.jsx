import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Paper,
  Button,
  Chip,
  IconButton,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Download, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Clock, 
  User, 
  Bot,
  Lightbulb,
  Bookmark 
} from 'lucide-react';
// import AICallingService from '../../services/aiCallingService';
import useCallWebSocket from '../../hooks/useCallWebSocket';

const TranscriptionDetail = ({ callId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState(null);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // WebSocket for real-time transcript updates
  const { lastMessage } = useCallWebSocket('current-user-id', {
    subscriptions: {
      'transcript_update': handleTranscriptUpdate,
      'insights_update': handleInsightsUpdate
    }
  });
  
  function handleTranscriptUpdate(data) {
    if (data.call_sid === callId) {
      // Update transcript with new segments
      setTranscript(prevTranscript => {
        if (!prevTranscript) return data.transcript;
        
        return {
          ...prevTranscript,
          segments: [...prevTranscript.segments, ...data.new_segments]
        };
      });
    }
  }
  
  function handleInsightsUpdate(data) {
    if (data.call_sid === callId) {
      setInsights(data.insights);
      setLoadingInsights(false);
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const transcriptData = await AICallingService.getCallTranscript(callId);
        setTranscript(transcriptData);
        
        // Also try to fetch insights if available
        try {
          const insightsData = await AICallingService.getCallInsights(callId);
          setInsights(insightsData);
        } catch (err) {
          // It's okay if insights aren't available yet
          console.log('Insights not available yet:', err);
        }
      } catch (err) {
        setError(`Failed to load transcript: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [callId]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleGenerateInsights = async () => {
    try {
      setLoadingInsights(true);
      await AICallingService.requestInsights(callId);
      // The insights will come through WebSocket
    } catch (err) {
      setError(`Failed to request insights: ${err.message}`);
      setLoadingInsights(false);
    }
  };
  
  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio control logic would go here
  };
  
  const handleNextSegment = () => {
    if (transcript && currentSegmentIndex < transcript.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    }
  };
  
  const handlePreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {transcript && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="transcript tabs">
              <Tab label="Transcript" />
              <Tab label="AI Insights" />
            </Tabs>
          </Box>
          
          {/* Transcript Tab */}
          {activeTab === 0 && (
            <>
              {/* Audio controls */}
              <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton onClick={handlePreviousSegment} disabled={currentSegmentIndex === 0}>
                    <SkipBack size={20} />
                  </IconButton>
                  <IconButton onClick={handlePlayAudio}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </IconButton>
                  <IconButton onClick={handleNextSegment} disabled={!transcript || currentSegmentIndex === transcript.segments.length - 1}>
                    <SkipForward size={20} />
                  </IconButton>
                </Stack>
                
                <Typography variant="body2" color="text.secondary">
                  {transcript.segments[currentSegmentIndex] ? 
                    formatTime(transcript.segments[currentSegmentIndex].start_time) : '0:00'} / 
                  {transcript.duration ? formatTime(transcript.duration) : '0:00'}
                </Typography>
                
                <Button startIcon={<Download size={16} />} size="small">
                  Download
                </Button>
              </Paper>
              
              {/* Transcript segments */}
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                {transcript.segments.map((segment, index) => (
                  <Box 
                    key={index} 
                    mb={2} 
                    p={2} 
                    bgcolor={segment.speaker === 'ai' ? 'rgba(25, 118, 210, 0.05)' : 'rgba(46, 125, 50, 0.05)'}
                    borderRadius={1}
                    border={currentSegmentIndex === index ? '1px solid' : 'none'}
                    borderColor={currentSegmentIndex === index ? 'primary.main' : 'transparent'}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Box 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: segment.speaker === 'ai' ? 'primary.main' : 'success.main',
                          color: 'white'
                        }}
                      >
                        {segment.speaker === 'ai' ? <Bot size={18} /> : <User size={18} />}
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {segment.speaker === 'ai' ? 'AI Assistant' : 'Customer'}
                      </Typography>
                      <Chip 
                        icon={<Clock size={14} />} 
                        label={formatTime(segment.start_time)} 
                        size="small" 
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body1">{segment.text}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
          
          {/* Insights Tab */}
          {activeTab === 1 && (
            <>
              {insights ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Summary</Typography>
                        <Typography paragraph>{insights.summary}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Key Points</Typography>
                        <Stack spacing={1}>
                          {insights.keyPoints.map((point, index) => (
                            <Box key={index} display="flex" gap={1}>
                              <Bookmark size={18} color="#1976d2" style={{ flexShrink: 0, marginTop: 4 }} />
                              <Typography>{point}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Action Items</Typography>
                        <Stack spacing={1}>
                          {insights.actionItems.map((item, index) => (
                            <Box key={index} display="flex" gap={1}>
                              <Lightbulb size={18} color="#ed6c02" style={{ flexShrink: 0, marginTop: 4 }} />
                              <Typography>{item}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
                        <Grid container spacing={3} mt={1}>
                          <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Customer Sentiment
                              </Typography>
                              <Typography 
                                variant="h4" 
                                color={
                                  insights.sentiment.user > 0.5 ? 'success.main' : 
                                  insights.sentiment.user < 0 ? 'error.main' : 
                                  'warning.main'
                                }
                              >
                                {insights.sentiment.user > 0.5 ? 'Positive' : 
                                 insights.sentiment.user < 0 ? 'Negative' : 
                                 'Neutral'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                AI Sentiment
                              </Typography>
                              <Typography 
                                variant="h4" 
                                color="primary.main"
                              >
                                Positive
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Overall Tone
                              </Typography>
                              <Typography variant="h4">{insights.sentiment.overall}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Box textAlign="center" py={5}>
                  <Typography variant="h6" gutterBottom>No AI Insights Available</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Generate AI insights to analyze this call's content, sentiment, and key points.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={handleGenerateInsights}
                    disabled={loadingInsights}
                    startIcon={loadingInsights ? <CircularProgress size={20} /> : <Lightbulb size={20} />}
                  >
                    {loadingInsights ? 'Generating...' : 'Generate Insights'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default TranscriptionDetail;

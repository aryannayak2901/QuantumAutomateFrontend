import React, { useState, useEffect, useContext } from 'react';
import useCallWebSocket from '../../hooks/useCallWebSocket';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  TablePagination
} from '@mui/material';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PlayCircle, 
  Download, 
  MessageSquare, 
  Lightbulb 
} from 'lucide-react';
import AICallingService from '../../services/aiCallingService';

const CallStatusChip = ({ status }) => {
  let color = "default";
  
  switch(status) {
    case "completed":
      color = "success";
      break;
    case "in-progress":
      color = "info";
      break;
    case "failed":
      color = "error";
      break;
    case "busy":
    case "no-answer":
      color = "warning";
      break;
    default:
      color = "default";
  }
  
  return <Chip label={status} color={color} size="small" />;
};

const CallLogs = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);
  const [openInsightsDialog, setOpenInsightsDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { isConnected, lastMessage } = useCallWebSocket('current-user-id', {
    subscriptions: {
      'call_status_update': handleCallStatusUpdate,
      'call_transcript_update': handleTranscriptUpdate
    }
  });

  function handleCallStatusUpdate(data) {
    // If we have a status update, update the corresponding call in the list
    if (data.call_sid) {
      setCallLogs(prevLogs => {
        return prevLogs.map(call => {
          if (call.id === data.call_sid) {
            return { ...call, status: data.status, duration: data.duration };
          }
          return call;
        });
      });
    }
  }

  function handleTranscriptUpdate(data) {
    // If we have a transcript update, mark the call as having a transcript
    if (data.call_sid) {
      setCallLogs(prevLogs => {
        return prevLogs.map(call => {
          if (call.id === data.call_sid) {
            return { ...call, hasTranscript: true };
          }
          return call;
        });
      });
    }
  }
  
  useEffect(() => {
    fetchCallLogs();
  }, []);
  
  // Update logs when we receive a new call from WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'new_call') {
      fetchCallLogs(); // Refresh the entire list to get the new call
    }
  }, [lastMessage]);
  
  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const response = await AICallingService.getCallLogs();
      setCallLogs(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch call logs');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTranscript = async (callId) => {
    try {
      const transcript = await AICallingService.getCallTranscript(callId);
      setSelectedCall({ ...callLogs.find(call => call.id === callId), transcript });
      setOpenTranscriptDialog(true);
    } catch (err) {
      setError(`Failed to load transcript: ${err.message}`);
    }
  };
  
  const handleViewInsights = async (callId) => {
    try {
      const insights = await AICallingService.getCallInsights(callId);
      setSelectedCall({ ...callLogs.find(call => call.id === callId), insights });
      setOpenInsightsDialog(true);
    } catch (err) {
      setError(`Failed to load insights: ${err.message}`);
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
        <Button variant="contained" onClick={fetchCallLogs} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }
  
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Call Logs</Typography>
      
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {callLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No call logs found</TableCell>
                  </TableRow>
                ) : (
                  callLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          {call.direction === 'inbound' ? (
                            <Tooltip title="Incoming">
                              <PhoneIncoming size={20} color="#4caf50" />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Outgoing">
                              <PhoneOutgoing size={20} color="#2196f3" />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>{call.phoneNumber}</TableCell>
                        <TableCell>{formatDate(call.timestamp)}</TableCell>
                        <TableCell>{formatDuration(call.duration)}</TableCell>
                        <TableCell>
                          <CallStatusChip status={call.status} />
                        </TableCell>
                        <TableCell>
                          {call.recordingUrl && (
                            <Tooltip title="Play Recording">
                              <IconButton onClick={() => window.open(call.recordingUrl)}>
                                <PlayCircle size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {call.hasTranscript && (
                            <Tooltip title="View Transcript">
                              <IconButton onClick={() => handleViewTranscript(call.id)}>
                                <MessageSquare size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {call.hasInsights && (
                            <Tooltip title="View AI Insights">
                              <IconButton onClick={() => handleViewInsights(call.id)}>
                                <Lightbulb size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={callLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Transcript Dialog */}
      <Dialog
        open={openTranscriptDialog}
        onClose={() => setOpenTranscriptDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Call Transcript
          <Typography variant="subtitle2" color="text.secondary">
            {selectedCall?.phoneNumber} - {selectedCall?.timestamp && formatDate(selectedCall.timestamp)}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCall?.transcript ? (
            <Box>
              {selectedCall.transcript.segments.map((segment, index) => (
                <Box 
                  key={index} 
                  mb={2} 
                  p={2} 
                  bgcolor={segment.speaker === 'ai' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)'}
                  borderRadius={1}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {segment.speaker === 'ai' ? 'AI' : 'User'} ({formatDuration(segment.start_time)})
                  </Typography>
                  <Typography variant="body1">{segment.text}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No transcript available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTranscriptDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Download size={16} />}
            onClick={() => {/* Download transcript functionality */}}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Insights Dialog */}
      <Dialog
        open={openInsightsDialog}
        onClose={() => setOpenInsightsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          AI Call Insights
          <Typography variant="subtitle2" color="text.secondary">
            {selectedCall?.phoneNumber} - {selectedCall?.timestamp && formatDate(selectedCall.timestamp)}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCall?.insights ? (
            <Box>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography paragraph>{selectedCall.insights.summary}</Typography>
              
              <Typography variant="h6" gutterBottom>Key Points</Typography>
              <ul>
                {selectedCall.insights.keyPoints.map((point, index) => (
                  <li key={index}>
                    <Typography>{point}</Typography>
                  </li>
                ))}
              </ul>
              
              <Typography variant="h6" gutterBottom>Action Items</Typography>
              <ul>
                {selectedCall.insights.actionItems.map((item, index) => (
                  <li key={index}>
                    <Typography>{item}</Typography>
                  </li>
                ))}
              </ul>
              
              <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">User Sentiment</Typography>
                  <Typography 
                    variant="h6" 
                    color={
                      selectedCall.insights.sentiment.user > 0.5 ? 'success.main' : 
                      selectedCall.insights.sentiment.user < 0 ? 'error.main' : 
                      'warning.main'
                    }
                  >
                    {selectedCall.insights.sentiment.user > 0.5 ? 'Positive' : 
                     selectedCall.insights.sentiment.user < 0 ? 'Negative' : 
                     'Neutral'}
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">Overall Tone</Typography>
                  <Typography variant="h6">{selectedCall.insights.sentiment.overall}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>No insights available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsightsDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Download size={16} />}
            onClick={() => {/* Download insights functionality */}}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallLogs;

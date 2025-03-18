import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  Paper,
  Button
} from '@mui/material';
import useCallWebSocket from '../../hooks/useCallWebSocket';
import callAgentApiAdapter from '../../services/callAgentApiAdapter';
// import CallAgent from './CallAgent';
import AntDesignWrapper from './AntDesignWrapper';

/**
 * CallAgentAdapter serves as a bridge between the Ant Design based CallAgent
 * and the Material-UI based dashboard. It handles:
 * 1. API translation - mapping backend endpoints to the right service calls
 * 2. WebSocket integration
 * 3. Error handling
 * 4. UI framework compatibility
 */
const CallAgentAdapter = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [callData, setCallData] = useState([]);
  const [scripts, setScripts] = useState([]);
  
  // Set up WebSocket for real-time call updates
  const { lastMessage, connectionState } = useCallWebSocket(localStorage.getItem('userId') || 'current-user', {
    subscriptions: {
      'call_status_update': handleCallStatusUpdate,
      'new_call': handleNewCall
    },
    onConnectionStateChange: (state) => setConnectionStatus(state)
  });
  
  // Set up API handlers for CallAgent using our adapter
  const apiHandlers = {
    fetchCalls: async (campaignFilter = null) => {
      try {
        setLoading(true);
        return await callAgentApiAdapter.fetchCalls(campaignFilter);
      } catch (error) {
        console.error('Error fetching calls:', error);
        setError('Failed to load call data');
        return [];
      } finally {
        setLoading(false);
      }
    },
    
    fetchScripts: async () => {
      try {
        return await callAgentApiAdapter.fetchScripts();
      } catch (error) {
        console.error('Error fetching scripts:', error);
        return [];
      }
    },
    
    makeCall: async (phoneNumber, scriptId, options = {}) => {
      try {
        return await callAgentApiAdapter.makeCall(phoneNumber, scriptId, options);
      } catch (error) {
        throw error;
      }
    },
    
    saveScript: async (scriptData) => {
      try {
        return await callAgentApiAdapter.saveScript(scriptData);
      } catch (error) {
        throw error;
      }
    },

    // Additional API handlers that may be needed
    fetchCampaigns: async () => {
      try {
        return await callAgentApiAdapter.fetchCampaigns();
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
      }
    },

    fetchLeads: async () => {
      try {
        return await callAgentApiAdapter.fetchLeads();
      } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
      }
    }
  };
  
  function handleCallStatusUpdate(data) {
    // Update call status in the data array
    setCallData(prevCalls => {
      return prevCalls.map(call => {
        if (call.call_sid === data.call_sid) {
          return {...call, ...data};
        }
        return call;
      });
    });
  }
  
  function handleNewCall(data) {
    // Add new call to the data array
    setCallData(prevCalls => [data, ...prevCalls]);
  }
  
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Pre-fetch the data to initialize the component
        const [callsData, scriptsData] = await Promise.all([
          callAgentApiAdapter.fetchCalls(),
          callAgentApiAdapter.fetchScripts()
        ]);
        
        setCallData(callsData);
        setScripts(scriptsData);
      } catch (err) {
        setError(`Failed to initialize data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  if (loading && !callData.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    );
  }
  
  return (
    <Paper elevation={0} sx={{ bgcolor: 'background.default' }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">AI Call Agent</Typography>
        <Typography variant="body2" color={connectionStatus === 'connected' ? 'success.main' : 'error.main'}>
          {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </Typography>
      </Box>
      
      {/* Wrap the Ant Design CallAgent component in our style wrapper */}
      <AntDesignWrapper>
        <CallAgent 
          apiHandlers={apiHandlers}
          initialData={{
            calls: callData,
            scripts: scripts
          }}
        />
      </AntDesignWrapper>
    </Paper>
  );
};

export default CallAgentAdapter;

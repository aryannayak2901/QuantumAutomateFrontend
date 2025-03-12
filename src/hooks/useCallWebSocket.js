import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';

/**
 * A hook to handle WebSocket connections for real-time call updates
 * @param {string} userId - The ID of the current user
 * @param {Object} options - Options for configuring the WebSocket behavior
 * @returns {Object} WebSocket state and control functions
 */
const useCallWebSocket = (userId, options = {}) => {
  const { autoConnect = true, subscriptions = {}, useMockData = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const mockIntervalRef = useRef(null);
  const mockDataEnabled = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  
  // Set up mock data simulation for development purposes
  const setupMockDataSimulation = useCallback(() => {
    if (mockDataEnabled.current || !useMockData) return;
    
    console.log('Setting up mock data simulation for call updates');
    mockDataEnabled.current = true;
    
    // Clear any existing interval
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
    }
    
    // Set up interval to simulate incoming call data
    mockIntervalRef.current = setInterval(() => {
      const mockEvents = [
        {
          type: 'call_status_update',
          call_id: `mock-${Math.floor(Math.random() * 1000)}`,
          status: ['in-progress', 'completed', 'scheduled'][Math.floor(Math.random() * 3)],
          duration: Math.floor(Math.random() * 300),
          timestamp: new Date().toISOString()
        },
        {
          type: 'call_transcript_update',
          call_id: `mock-${Math.floor(Math.random() * 1000)}`,
          transcript: 'This is a simulated transcript update for development purposes.',
          timestamp: new Date().toISOString()
        },
        {
          type: 'new_call',
          call_id: `mock-${Math.floor(Math.random() * 1000)}`,
          phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          timestamp: new Date().toISOString()
        }
      ];
      
      // Pick a random mock event
      const mockEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setLastMessage(mockEvent);
      
      // Trigger subscribed callbacks
      if (subscriptions[mockEvent.type]) {
        subscriptions[mockEvent.type](mockEvent);
      }
    }, 20000); // Simulate events every 20 seconds
  }, [useMockData, subscriptions]);
  
  // Connect to the WebSocket
  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');
      websocketService.connect(userId || 'demo-user');
      setIsConnected(websocketService.isConnected);
      setConnectionStatus(websocketService.isConnected ? 'connected' : 'connecting');
      setHasError(false);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setHasError(true);
      setConnectionStatus('error');
      reconnectAttemptsRef.current++;
      
      // If we've tried to connect several times and failed, fall back to mock data
      if (reconnectAttemptsRef.current >= 3 && useMockData) {
        setupMockDataSimulation();
      }
    }
  }, [userId, setupMockDataSimulation, useMockData]);
  
  // Disconnect from the WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((messageType, payload) => {
    return websocketService.sendMessage(messageType, payload);
  }, []);
  
  // Subscribe to all message types
  useEffect(() => {
    const handleAllMessages = (data) => {
      setLastMessage(data);
    };
    
    const unsubscribeAll = websocketService.subscribe('all', handleAllMessages);
    
    return () => {
      unsubscribeAll();
    };
  }, []);
  
  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      if (autoConnect) {
        disconnect();
      }
      
      // Clear mock data interval if it exists
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
        mockIntervalRef.current = null;
      }
    };
  }, [autoConnect, connect, disconnect]);
  
  // Set up subscriptions from options
  useEffect(() => {
    const unsubscribers = Object.entries(subscriptions).map(([eventType, callback]) => {
      return websocketService.subscribe(eventType, callback);
    });
    
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscriptions]);
  
  // Update connection status when websocketService status changes
  useEffect(() => {
    const updateConnectionStatus = () => {
      const connected = websocketService.isConnected;
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      
      // If we're not connected after several attempts and not using mock data yet, enable it
      if (!connected && reconnectAttemptsRef.current >= 2 && !mockDataEnabled.current && useMockData) {
        setupMockDataSimulation();
      }
    };
    
    // Check connection status periodically
    const interval = setInterval(updateConnectionStatus, 5000);
    
    // Initial check
    updateConnectionStatus();
    
    return () => {
      clearInterval(interval);
    };
  }, [setupMockDataSimulation, useMockData]);
  
  return {
    isConnected,
    lastMessage,
    hasError,
    connectionStatus,
    connect,
    disconnect,
    sendMessage
  };
};

export default useCallWebSocket;

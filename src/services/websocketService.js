class WebSocketService {
    constructor() {
        this.socket = null;
        this.callbackMap = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        // Check if we're in development mode (localhost)
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // In development, use a dedicated WebSocket server URL
        this.baseUrl = import.meta.env.VITE_WS_URL || 
                      (isDev ? 'ws://localhost:8000/ws/' : `ws://${window.location.host}/ws/`);
                      
        console.log('WebSocket base URL:', this.baseUrl);
    }

    connect(userId) {
        if (this.socket && this.isConnected) {
            console.log('WebSocket already connected');
            return;
        }
        
        const url = `${this.baseUrl}calls/${userId}/`;
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
        };
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);
                
                // Route the message to appropriate callbacks
                if (data.type && this.callbackMap.has(data.type)) {
                    this.callbackMap.get(data.type).forEach(callback => callback(data));
                }
                
                // Also trigger any 'all' event listeners
                if (this.callbackMap.has('all')) {
                    this.callbackMap.get('all').forEach(callback => callback(data));
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
        
        this.socket.onclose = (event) => {
            console.log('WebSocket disconnected:', event);
            this.isConnected = false;
            
            // Attempt to reconnect
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                console.log(`Attempting to reconnect in ${timeout}ms...`);
                
                setTimeout(() => {
                    this.connect(userId);
                }, timeout);
            }
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }
    
    subscribe(eventType, callback) {
        if (!this.callbackMap.has(eventType)) {
            this.callbackMap.set(eventType, []);
        }
        this.callbackMap.get(eventType).push(callback);
        
        // Return an unsubscribe function
        return () => {
            const callbacks = this.callbackMap.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    sendMessage(messageType, payload) {
        if (!this.socket || !this.isConnected) {
            console.error('Cannot send message: WebSocket not connected');
            return false;
        }
        
        try {
            const message = {
                type: messageType,
                ...payload
            };
            
            this.socket.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    }
}

export default new WebSocketService();

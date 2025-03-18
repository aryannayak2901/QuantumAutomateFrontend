import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with consistent configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

/**
 * Fetch user notifications
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of notifications per page
 * @returns {Promise<Object>} - Notifications data
 */
export const getNotifications = async (params = { page: 1, limit: 10 }) => {
  try {
    const response = await apiClient.get('/api/notifications/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty data structure to prevent UI errors
    return {
      results: [],
      count: 0,
      unread_count: 0
    };
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Promise<Object>} - Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.post(`/api/notifications/${notificationId}/read/`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - Response data
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.post('/api/notifications/read-all/');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Get unread notification count
 * @returns {Promise<number>} - Number of unread notifications
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get('/api/notifications/unread-count/');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};
import React, { useState, useEffect } from 'react';
import { Menu, Badge, Button, List, Avatar, Typography, Empty, Spin, Tooltip } from 'antd';
import { BellOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import './NotificationDropdown.css';

const { Text, Title } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);

  // Fetch notifications when dropdown becomes visible
  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  // Fetch notifications on initial load to get unread count
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for notifications every 30 seconds
    const interval = setInterval(() => {
      if (!visible) { // Only poll for count when dropdown is closed
        fetchNotifications(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (countOnly = false) => {
    try {
      setLoading(true);
      const data = await getNotifications();
      
      if (!countOnly) {
        setNotifications(data.results || []);
      }
      
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <Avatar style={{ backgroundColor: '#1890ff' }} icon={<BellOutlined />} />;
      case 'lead':
        return <Avatar style={{ backgroundColor: '#52c41a' }} icon={<BellOutlined />} />;
      case 'call':
        return <Avatar style={{ backgroundColor: '#faad14' }} icon={<BellOutlined />} />;
      default:
        return <Avatar icon={<BellOutlined />} />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const notificationMenu = (
    <div className="notification-dropdown-container">
      <div className="notification-header">
        <Title level={5} style={{ margin: 0 }}>Notifications</Title>
        {unreadCount > 0 && (
          <Button type="link" onClick={handleMarkAllAsRead} size="small">
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="notification-content">
        {loading ? (
          <div className="notification-loading">
            <Spin />
          </div>
        ) : notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={notification => (
              <List.Item 
                className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                actions={[
                  !notification.read && (
                    <Tooltip title="Mark as read">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CheckOutlined />} 
                        onClick={() => handleMarkAsRead(notification.id)}
                      />
                    </Tooltip>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(notification.type)}
                  title={notification.title}
                  description={
                    <>
                      <div>{notification.message}</div>
                      <Text type="secondary" className="notification-time">
                        {getTimeAgo(notification.created_at)}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      
      <div className="notification-footer">
        <Button type="link" block onClick={() => fetchNotifications()}>
          Refresh
        </Button>
      </div>
    </div>
  );

  return {
    menu: notificationMenu,
    unreadCount,
    setVisible
  };
};

export default NotificationDropdown;
import React, { useEffect } from 'react';
import { Timeline, Card, Tag, Typography, Space, Button, Tooltip } from 'antd';
import {
  PhoneOutlined,
  MessageOutlined,
  EditOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ActivityTimeline.css';

dayjs.extend(relativeTime);

const { Text, Paragraph } = Typography;

const getActivityIcon = (type) => {
  switch (type) {
    case 'call':
      return <PhoneOutlined />;
    case 'message':
      return <MessageOutlined />;
    case 'note':
      return <FileTextOutlined />;
    case 'status_change':
      return <CheckCircleOutlined />;
    case 'assignment':
      return <UserSwitchOutlined />;
    case 'scheduled':
      return <ClockCircleOutlined />;
    default:
      return <EditOutlined />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'call':
      return 'blue';
    case 'message':
      return 'cyan';
    case 'note':
      return 'orange';
    case 'status_change':
      return 'green';
    case 'assignment':
      return 'purple';
    case 'scheduled':
      return 'gold';
    default:
      return 'gray';
  }
};

const ActivityTimeline = ({ activities = [], loading = false, onLoadMore = () => {} }) => {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);
  
  if (!Array.isArray(activities)) {
    return <div>No activities available.</div>;
  }

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case 'call':
        return (
          <>
            <Text strong>{activity.title}</Text>
            <Paragraph type="secondary">
              Duration: {activity.duration} seconds
              {activity.transcript && (
                <Button type="link" size="small">
                  View Transcript
                </Button>
              )}
            </Paragraph>
            {activity.notes && (
              <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {activity.notes}
              </Paragraph>
            )}
          </>
        );

      case 'status_change':
        return (
          <>
            <Text strong>Status changed to </Text>
            <Tag color="blue">{activity.newStatus}</Tag>
            {activity.notes && (
              <Paragraph type="secondary">{activity.notes}</Paragraph>
            )}
          </>
        );

      case 'note':
        return (
          <>
            <Text strong>{activity.title}</Text>
            <Paragraph>{activity.content}</Paragraph>
          </>
        );

      case 'assignment':
        return (
          <>
            <Text strong>Assigned to </Text>
            <Tag>{activity.assignee}</Tag>
            {activity.notes && (
              <Paragraph type="secondary">{activity.notes}</Paragraph>
            )}
          </>
        );

      case 'scheduled':
        return (
          <>
            <Text strong>{activity.title}</Text>
            <Paragraph>
              Scheduled for: {dayjs(activity.scheduledFor).format('MMM D, YYYY h:mm A')}
            </Paragraph>
            {activity.notes && (
              <Paragraph type="secondary">{activity.notes}</Paragraph>
            )}
          </>
        );

      default:
        return <Text>{activity.content}</Text>;
    }
  };

  return (
    <Card 
      className="activity-timeline-card"
      title="Activity Timeline" 
      extra={
        <Button type="link" onClick={onLoadMore} className="pulse-animation">
          Load More
        </Button>
      }
      loading={loading}
      data-aos="fade-up"
    >
      <Timeline>
        {activities.map((activity) => (
          <Timeline.Item
            key={activity.id}
            dot={
              <Tooltip title={activity.type}>
                {getActivityIcon(activity.type)}
              </Tooltip>
            }
            color={getActivityColor(activity.type)}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {renderActivityContent(activity)}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {activity.user && `${activity.user} • `}
                {dayjs(activity.timestamp).fromNow()}
              </Text>
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

export default ActivityTimeline;
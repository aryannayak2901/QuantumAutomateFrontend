import React from 'react';
import { Menu, Avatar, Typography, Dropdown, Space } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/settings?tab=profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Space className="cursor-pointer">
        <Avatar 
          src={user?.profile_picture} 
          icon={!user?.profile_picture && <UserOutlined />} 
        />
        <div className="hidden md:block">
          <Text strong>{user?.full_name || user?.email || 'User'}</Text>
        </div>
      </Space>
    </Dropdown>
  );
};

export default ProfileDropdown;
import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space } from 'antd';
import { 
    BellOutlined, 
    UserOutlined, 
    SettingOutlined, 
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [notifications] = useState([
        {
            id: 1,
            title: 'New Lead',
            description: 'You have a new lead from Instagram',
            time: '5 min ago',
            unread: true
        },
        {
            id: 2,
            title: 'Call Scheduled',
            description: 'Upcoming call in 30 minutes',
            time: '10 min ago',
            unread: false
        }
    ]);

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
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
            onClick: () => {
                // Implement logout logic
                navigate('/signin');
            }
        }
    ];

    const notificationMenu = (
        <Menu
            items={notifications.map(notification => ({
                key: notification.id,
                label: (
                    <div className="notification-item">
                        <div className="flex justify-between">
                            <span className="font-bold">{notification.title}</span>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                )
            }))}
        />
    );

    return (
        <AntHeader className="bg-white px-4 flex justify-between items-center border-b">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
            />
            
            <div className="flex items-center gap-4">
                <Dropdown 
                    overlay={notificationMenu} 
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Badge count={notifications.filter(n => n.unread).length}>
                        <Button type="text" icon={<BellOutlined />} />
                    </Badge>
                </Dropdown>

                <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Space className="cursor-pointer">
                        <Avatar icon={<UserOutlined />} />
                        <span className="hidden md:inline">John Doe</span>
                    </Space>
                </Dropdown>
            </div>

            <style jsx>{`
                .notification-item {
                    padding: 8px 12px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .notification-item:last-child {
                    border-bottom: none;
                }
            `}</style>
        </AntHeader>
    );
};

export default Header; 
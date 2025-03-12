import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    InstagramOutlined,
    UserOutlined,
    PhoneOutlined,
    SettingOutlined,
    RobotOutlined,
    MessageOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'instagram',
            icon: <InstagramOutlined />,
            label: 'Instagram',
            children: [
                {
                    key: '/instagram',
                    icon: <InstagramOutlined />,
                    label: 'Overview',
                },
                {
                    key: '/instagram/automation',
                    icon: <MessageOutlined />,
                    label: 'DM Automation',
                },
            ],
        },
        {
            key: '/leads',
            icon: <UserOutlined />,
            label: 'Lead Management',
        },
        {
            key: '/calling',
            icon: <PhoneOutlined />,
            label: 'AI Calling',
            children: [
                {
                    key: '/calling/dashboard',
                    icon: <DashboardOutlined />,
                    label: 'Call Dashboard',
                },
                {
                    key: '/calling/agent',
                    icon: <RobotOutlined />,
                    label: 'AI Agent',
                },
                {
                    key: '/calling/scripts',
                    icon: <MessageOutlined />,
                    label: 'Call Scripts',
                },
            ],
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Sider
            width={250}
            className="sidebar"
            breakpoint="lg"
            collapsedWidth="0"
        >
            <div className="logo p-4">
                <h1 className="text-white text-xl font-bold">QuantumAutomate</h1>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['instagram', 'calling']}
                items={menuItems}
                onClick={handleMenuClick}
            />
        </Sider>
    );
};

export default Sidebar; 
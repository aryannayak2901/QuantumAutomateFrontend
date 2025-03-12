import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Typography, Button } from 'antd';
import {
    DashboardOutlined,
    InstagramOutlined,
    MessageOutlined,
    UserOutlined,
    PhoneOutlined,
    SettingOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Function to determine which menu keys should be selected based on the current path
    const getSelectedKeys = () => {
        const path = location.pathname;
        if (path === '/dashboard') return ['dashboard'];
        if (path.includes('/dashboard/leads/pipeline')) return ['leads-pipeline'];
        if (path.includes('/dashboard/leads')) return ['leads-list'];
        if (path.includes('/instagram/overview')) return ['overview'];
        if (path.includes('/instagram/dm-automation')) return ['dm-automation'];
        if (path.includes('/calling/dashboard')) return ['call-dashboard'];
        if (path.includes('/calling/agent')) return ['call-agent'];
        if (path.includes('/calling/scripts')) return ['scripts'];
        if (path.includes('/settings')) return ['settings'];
        return [];
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard')
        },
        {
            key: 'instagram',
            icon: <InstagramOutlined />,
            label: 'Instagram',
            children: [
                {
                    key: 'overview',
                    label: 'Overview',
                    onClick: () => navigate('/instagram/overview')
                },
                {
                    key: 'dm-automation',
                    label: 'DM Automation',
                    onClick: () => navigate('/instagram/dm-automation')
                }
            ]
        },
        {
            key: 'leads',
            icon: <UserOutlined />,
            label: 'Lead Management',
            children: [
                {
                    key: 'leads-list',
                    label: 'List View',
                    onClick: () => navigate('/dashboard/leads')
                },
                {
                    key: 'leads-pipeline',
                    label: 'Pipeline View',
                    onClick: () => navigate('/dashboard/leads/pipeline')
                }
            ]
        },
        {
            key: 'calling',
            icon: <PhoneOutlined />,
            label: 'AI Calling',
            children: [
                {
                    key: 'call-dashboard',
                    label: 'Call Dashboard',
                    onClick: () => navigate('/calling/dashboard')
                },
                {
                    key: 'call-agent',
                    label: 'AI Call Agent',
                    onClick: () => navigate('/calling/agent')
                },
                {
                    key: 'scripts',
                    label: 'Call Scripts',
                    onClick: () => navigate('/calling/scripts')
                }
            ]
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/settings')
        }
    ];

    return (
        <Layout className="min-h-screen">
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                className="bg-dark-blue"
                width={260}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                }}
            >
                <div className="p-4 flex items-center">
                    <InstagramOutlined className="text-2xl text-blue-400 mr-2" />
                    {!collapsed && (
                        <span className="text-lg font-semibold text-white">
                            QuantumAI
                        </span>
                    )}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={['leads', 'instagram', 'calling']}
                    items={menuItems}
                    className="bg-dark-blue border-r-0"
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 260, minHeight: '100vh' }}>
                <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <div className="flex items-center space-x-4">
                        <Badge count={5} className="cursor-pointer">
                            <BellOutlined style={{ fontSize: '20px' }} />
                        </Badge>
                        <Avatar icon={<UserOutlined />} />
                    </div>
                </Header>
                <Content className="p-6 bg-gray-50 min-h-screen">
                    {children}
                </Content>
            </Layout>

            <style jsx>{`
                .bg-dark-blue {
                    background-color: #001529;
                }
                .ant-menu.bg-dark-blue {
                    background-color: #001529;
                }
                .ant-layout-sider-trigger {
                    background-color: #002140;
                }
            `}</style>
        </Layout>
    );
};

export default DashboardLayout; 
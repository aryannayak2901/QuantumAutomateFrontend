import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Instagram as InstagramIcon,
    Phone as PhoneIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';
import InstagramDashboard from '../../components/UserDashboardComponents/InstagramDashboard';
import AICallingDashboard from '../../components/UserDashboardComponents/AICallingDashboard';
import CRMDashboard from '../../components/UserDashboardComponents/CRMDashboard';
import { logoutUser } from '../../api';

const drawerWidth = 240;

const UserDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('instagram');
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        await logoutUser();
    };

    const menuItems = [
        { id: 'instagram', text: 'Instagram', icon: <InstagramIcon />, component: <InstagramDashboard /> },
        { id: 'calling', text: 'AI Calling', icon: <PhoneIcon />, component: <AICallingDashboard /> },
        { id: 'crm', text: 'CRM', icon: <PeopleIcon />, component: <CRMDashboard /> },
        { id: 'settings', text: 'Settings', icon: <SettingsIcon /> }
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    QuantumAutomate
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.id}
                        selected={selectedTab === item.id}
                        onClick={() => setSelectedTab(item.id)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    const renderContent = () => {
        const selectedItem = menuItems.find(item => item.id === selectedTab);
        return selectedItem?.component || <Box p={3}>Content not available</Box>;
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {menuItems.find(item => item.id === selectedTab)?.text || 'Dashboard'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    marginTop: '64px'
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );
};

export default UserDashboard;

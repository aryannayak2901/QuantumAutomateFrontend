import React from "react";
import { Layout, Menu, Dropdown } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
    DashboardOutlined,
    PhoneOutlined,
    FileOutlined,
    CalendarOutlined,
    DownOutlined,
    FlagOutlined
} from "@ant-design/icons";
import AICallingAgentHome from "./AICallingAgentHome/AICallingAgentHome";
import CampaignManager from "./CampaignManager/CampaignManager";
import CallLogs from "./CallLogs/CallLogs";
import Appointments from "./Appointments/Appointments";
import PredefinedScripts from "./AIScripts/PredefinedScripts/PredefinedScripts";
import CustomScripts from "./AIScripts/CustomScripts/CustomScripts";
import ScriptTester from "./AIScripts/ScriptTester/ScriptTester";

const { Header, Content, Footer } = Layout;

const AICallingAgent = () => {
    // Dropdown menu for AI Scripts
    const aiScriptsMenu = (
        <Menu
            items={[
                {
                    key: 'predefined',
                    label: <Link to="/ai-calling-agent/predefined-scripts">Predefined Scripts</Link>
                },
                {
                    key: 'custom',
                    label: <Link to="/ai-calling-agent/custom-scripts">Custom Scripts</Link>
                },
                {
                    key: 'tester',
                    label: <Link to="/ai-calling-agent/script-tester">Script Tester</Link>
                }
            ]}
        />
    );

    // Menu items for navigation
    const menuItems = [
        {
            key: "1",
            icon: <DashboardOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: "2",
            icon: <PhoneOutlined />,
            label: (
                <Dropdown overlay={aiScriptsMenu} trigger={['click']}>
                    {/* Dropdown's child should be a single element */}
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                        AI Scripts <DownOutlined />
                    </span>
                </Dropdown>
            ),
        },
        {
            key: "3",
            icon: <FlagOutlined />,
            label: <Link to="/campaigns">Campaign Manager</Link>,
        },
        {
            key: "4",
            icon: <FileOutlined />,
            label: <Link to="/logs">Call Logs</Link>,
        },
        {
            key: "5",
            icon: <CalendarOutlined />,
            label: <Link to="/appointments">Appointments</Link>,
        },
    ];

    return (
        <Router>
            <Layout style={{ minHeight: "100vh" }}>
                <Header style={{ backgroundColor: "#001529", padding: "0 20px" }}>
                    <div
                        style={{
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "bold",
                            float: "left",
                            marginRight: "30px",
                        }}
                    >
                        AI Calling Agent
                    </div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} items={menuItems} />
                </Header>
                <Content
                    style={{
                        margin: "16px",
                        padding: "20px",
                        backgroundColor: "#f0f2f5",
                        borderRadius: "8px",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<AICallingAgentHome />} />
                        <Route path="/campaigns" element={<CampaignManager />} />
                        <Route path="/logs" element={<CallLogs />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/ai-calling-agent/predefined-scripts" element={<PredefinedScripts />} />
                        <Route path="/ai-calling-agent/custom-scripts" element={<CustomScripts />} />
                        <Route path="/ai-calling-agent/script-tester" element={<ScriptTester />} />
                    </Routes>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                        backgroundColor: "#001529",
                        color: "white",
                        fontSize: "14px",
                    }}
                >
                    AI Calling Agent ©2025
                </Footer>
            </Layout>
        </Router>
    );
};

export default AICallingAgent;

import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { Home, Users, Phone, Calendar, BarChart2, Settings } from "lucide-react";
import UserDashboardHome from "./UserDashboardHome/UserDashboardHome";
import LeadsManagement from "./LeadsManagement/LeadsManagement";
import AICallingAgent from "./AICallingAgent/AICallingAgent";
import WarmLeadsAndAppointments from "./WarmLeadsAndAppointments/WarmLeadsAndAppointments";

const UserDashboard = () => {
    const [navbarWidth, setNavbarWidth] = useState("20%"); // Default width as 20%
    const [isDragging, setIsDragging] = useState(false);
    const [activeSection, setActiveSection] = useState("home"); // Default active section

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newWidth = (e.clientX / window.innerWidth) * 100; // Calculate width as percentage
        if (newWidth > 5 && newWidth < 50) {
            // Set constraints for resizing (5% to 50%)
            setNavbarWidth(`${newWidth}%`);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setNavbarWidth("100%");
        }
    }, []);

    const renderActiveSection = () => {
        switch (activeSection) {
            case "home":
                return <UserDashboardHome />;
            case "leadManagement":
                return <LeadsManagement />;
            case "aiCallingAgent":
                return <AICallingAgent />;
            case "warmLeadsAppointments":
                return <WarmLeadsAndAppointments />;
            case "analytics":
                return <h2>Analytics Section (To be implemented)</h2>;
            case "settings":
                return <h2>Settings Section (To be implemented)</h2>;
            default:
                return <h2>Select a section from the menu.</h2>;
        }
    };

    return (
        <div
            className="user-dashboard-container"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                className="user-dashboard-navbar"
                style={{ width: navbarWidth }}
            >
                <div className="user-dashboard-logo-container">
                    <h2 className="user-dashboard-logo">Quantum Automate</h2>
                </div>
                <ul className="navbar">
                    <li
                        className={`navbar-item ${activeSection === "home" ? "active" : ""}`}
                        onClick={() => setActiveSection("home")}
                    >
                        <span><Home /></span><p>Home</p>
                    </li>
                    <li
                        className={`navbar-item ${activeSection === "leadManagement" ? "active" : ""}`}
                        onClick={() => setActiveSection("leadManagement")}
                    >
                        <span><Users /></span><p>Lead Management</p>
                    </li>
                    <li
                        className={`navbar-item ${activeSection === "aiCallingAgent" ? "active" : ""}`}
                        onClick={() => setActiveSection("aiCallingAgent")}
                    >
                        <span><Phone /></span><p>AI Calling Agent</p>
                    </li>
                    <li
                        className={`navbar-item ${activeSection === "warmLeadsAppointments" ? "active" : ""}`}
                        onClick={() => setActiveSection("warmLeadsAppointments")}
                    >
                        <span><Calendar /></span><p>Warm Leads & Appointments</p>
                    </li>
                    <li
                        className={`navbar-item ${activeSection === "analytics" ? "active" : ""}`}
                        onClick={() => setActiveSection("analytics")}
                    >
                        <span><BarChart2 /></span><p>Analytics</p>
                    </li>
                    <li
                        className={`navbar-item ${activeSection === "settings" ? "active" : ""}`}
                        onClick={() => setActiveSection("settings")}
                    >
                        <span><Settings /></span><p>Settings</p>
                    </li>
                </ul>
            </div>

            <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
                style={{ cursor: "ew-resize" }}
            ></div>

            <div className="user-dashboard-content-container">
                {renderActiveSection()}
            </div>
        </div>
    );
};

export default UserDashboard;

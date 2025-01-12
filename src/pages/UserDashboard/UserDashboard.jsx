import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { Home, Users, Phone, Calendar, BarChart2, Settings } from 'lucide-react';
import UserDashboardHome from "./UserDashboardHome/UserDashboardHome";
import LeadsManagement from "./LeadsManagement/LeadsManagement";

const UserDashboard = () => {
    const [navbarWidth, setNavbarWidth] = useState('20%'); // Default width as 20%
    const [isDragging, setIsDragging] = useState(false);

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
            setNavbarWidth('100%')
        }
    }, [])

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
                    <li className="navbar-item"><span><Home /></span><p>Home</p></li>
                    <li className="navbar-item"><span><Users /></span><p>Lead Management</p></li>
                    <li className="navbar-item"><span><Phone /></span><p>AI Calling Agent</p></li>
                    <li className="navbar-item"><span><Calendar /></span><p>Warm Leads & Appointments</p></li>
                    <li className="navbar-item"><span><BarChart2 /></span><p>Analytics</p></li>
                    <li className="navbar-item"><span><Settings /></span><p>Settings</p></li>
                </ul>
            </div>

            <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
                style={{ cursor: "ew-resize" }}
            ></div>
            
            <div className="user-dashboard-content-container">
                {/* <UserDashboardHome /> */}
                <LeadsManagement />
            </div>
        </div>
    );
};

export default UserDashboard;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Phone, Calendar, BarChart2, Settings as Setting, ChevronLeft, ChevronRight, Mails, ChevronDown, MoreVertical, LogOut } from "lucide-react";
import UserDashboardHome from "./UserDashboardHome/UserDashboardHome.jsx";
import LeadsManagement from "./LeadsManagement/LeadsManagement.jsx";
import AICallingAgent from "./AICallingAgent/AICallingAgent.jsx";
import WarmLeadsAndAppointments from "./WarmLeadsAndAppointments/WarmLeadsAndAppointments.jsx";
import Analytics from "./Analytics/Analytics.jsx";
import Settings from "./Settings/Settings.jsx";
import { DMStatusDashboard } from "../../components";
import { useAuth } from "../../context/AuthContext.jsx";
// import "./UserDashboard.css";

const allNavItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "leadManagement", label: "Lead Management", icon: Users, path: "/dashboard/leads" },
    { id: "dmStatus", label: "DM Status", icon: Mails, path: "/dashboard/dm-status" },
    {
        id: "aiCallingAgent",
        label: "AI Calling Agent",
        icon: Phone,
        subItems: [
            { id: "aiDashboard", label: "Dashboard", path: "/dashboard/ai-calling-agent" },
            { id: "twilioActivation", label: "Twilio Activation", path: "/dashboard/ai-calling-agent/twilio-activation" },
            { id: "callLogs", label: "Call Logs", path: "/dashboard/ai-calling-agent/logs" },
            { id: "appointments", label: "Appointments", path: "/dashboard/ai-calling-agent/appointments" },
        ],
    },
    { id: "warmLeadsAppointments", label: "Warm Leads & Appointments", icon: Calendar, path: "/dashboard/warm-leads" },
    { id: "analytics", label: "Analytics", icon: BarChart2, path: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: Setting, path: "/dashboard/settings" },
];

const Sidebar = ({ isNavCollapsed, setIsNavCollapsed, isMobile }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [visibleItems, setVisibleItems] = useState([]);
    const [overflowItems, setOverflowItems] = useState([]);
    const location = useLocation();
    const sidebarRef = React.useRef(null);
    const moreMenuRef = React.useRef(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // (Optional) Inform the backend that the user is logging out
            await API.post('users/logout/', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }).catch(() => console.log("Logout request failed, clearing local data instead."));
    
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
        }
    
        // ✅ Clear authentication tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    
        // ✅ Redirect to login page
        navigate('/signin');
    };
    

    useEffect(() => {
        if (!isMobile) {
            const calculateVisibleItems = () => {
                const sidebarHeight = sidebarRef.current?.clientHeight || 0;
                const itemHeight = 56;
                const availableHeight = sidebarHeight - 200;
                const maxVisibleItems = Math.floor(availableHeight / itemHeight);
                
                setVisibleItems(allNavItems.slice(0, maxVisibleItems - 1));
                setOverflowItems(allNavItems.slice(maxVisibleItems - 1));
            };

            calculateVisibleItems();
            window.addEventListener('resize', calculateVisibleItems);
            return () => window.removeEventListener('resize', calculateVisibleItems);
        } else {
            setVisibleItems(allNavItems.slice(0, 4));
            setOverflowItems(allNavItems.slice(4));
        }
    }, [isMobile]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setShowMoreMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (itemId) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const NavItem = ({ item, isOverflow = false }) => (
        <div className="relative group">
            <div
                className={`
                    flex items-center rounded-lg transition-all duration-300
                    ${isMobile ? 'flex-col py-2 px-3' : 'px-4 py-3'}
                    ${location.pathname === item.path ? 
                        'bg-primary-600 text-white' : 
                        'text-gray-400 hover:bg-primary-700/50 hover:text-white'}
                    ${isOverflow ? 'w-full' : ''}
                    cursor-pointer
                `}
                onClick={() => {
                    if (item.subItems) {
                        toggleDropdown(item.id);
                    } else {
                        window.location.href = item.path;
                        if (isOverflow) setShowMoreMenu(false);
                    }
                }}
            >
                <item.icon className={`
                    ${isMobile ? 'w-5 h-5 mb-1' : isNavCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}
                `} />
                {(!isNavCollapsed || isMobile || isOverflow) && (
                    <span className={`
                        font-medium whitespace-nowrap
                        ${isMobile ? 'text-xs' : 'text-sm'}
                    `}>
                        {isMobile && !isOverflow ? item.label.split(' ')[0] : item.label}
                    </span>
                )}
                {item.subItems && (isOverflow || !isMobile && !isNavCollapsed) && (
                    <ChevronDown className={`
                        w-4 h-4 ml-auto transition-transform
                        ${expandedItems[item.id] ? 'rotate-180' : ''}
                    `} />
                )}
            </div>

            {item.subItems && expandedItems[item.id] && (
                <div className={`
                    ${isOverflow ? 
                        'ml-4 mt-2 space-y-2' : 
                        isMobile ? 
                            'absolute bottom-full left-0 mb-2 w-48 bg-secondary-800 rounded-lg shadow-lg p-2' :
                            'pl-12 mt-2 space-y-2 border-l-2 border-primary-700'
                    }
                `}>
                    {item.subItems.map((subItem) => (
                        <Link
                            key={subItem.id}
                            to={subItem.path}
                            className={`
                                block py-2 px-3 rounded-lg text-sm transition-colors
                                ${location.pathname === subItem.path ?
                                    'text-white bg-primary-700' :
                                    'text-gray-400 hover:text-white hover:bg-primary-700/50'}
                            `}
                            onClick={() => setShowMoreMenu(false)}
                        >
                            {subItem.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <aside 
            ref={sidebarRef}
            className={`
                fixed ${isMobile ? 'bottom-0 left-0 w-full h-16' : 'top-0 left-0 h-screen'} 
                bg-secondary-900 text-white transition-all duration-300 z-50
                ${isMobile ? 'border-t border-primary-600' : isNavCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            {!isMobile && (
                <>
                    <div className={`p-6 ${isNavCollapsed ? 'text-center' : ''}`}>
                        <span className="text-2xl font-bold">
                            {isNavCollapsed ? "Q" : "Quantum"}<span className="text-primary-400">AI</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                        className="absolute -right-3 top-20 bg-primary-600 text-white p-1.5 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                    >
                        {isNavCollapsed ? 
                            <ChevronRight className="w-4 h-4" /> : 
                            <ChevronLeft className="w-4 h-4" />
                        }
                    </button>
                </>
            )}

            <nav className={`
                ${isMobile ? 'flex justify-around items-center h-full' : 'mt-8 px-4'}
                ${isMobile ? '' : 'space-y-2'}
            `}>
                {visibleItems.map((item) => (
                    <NavItem key={item.id} item={item} />
                ))}

                {overflowItems.length > 0 && (
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={`
                                flex items-center rounded-lg transition-all duration-300
                                ${isMobile ? 'flex-col py-2 px-3' : 'px-4 py-3'}
                                ${showMoreMenu ? 'bg-primary-600 text-white' : 'text-gray-400'}
                                hover:bg-primary-700/50 hover:text-white
                            `}
                        >
                            <MoreVertical className={`
                                ${isMobile ? 'w-5 h-5 mb-1' : isNavCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}
                            `} />
                            {(!isNavCollapsed || isMobile) && (
                                <span className="font-medium text-xs">More</span>
                            )}
                        </button>

                        {showMoreMenu && (
                            <div className={`
                                fixed ${isMobile ? 'bottom-20 left-0 right-0 mx-4' : 'top-0 left-full ml-2'} 
                                bg-secondary-800 rounded-lg shadow-lg p-2
                                border border-primary-700/50 backdrop-blur-lg
                                max-h-[80vh] overflow-y-auto
                                more-menu-animation
                            `}>
                                {overflowItems.map((item) => (
                                    <NavItem key={item.id} item={item} isOverflow />
                                ))}
                                {/* Logout button in overflow menu */}
                                <div
                                    className="flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    <span className="font-medium">Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Logout button for non-mobile view */}
                {!isMobile && (
                    <div
                        className={`
                            flex items-center rounded-lg transition-all duration-300 mt-auto mb-8 px-4 py-3
                            text-red-500 hover:bg-red-500/10 cursor-pointer
                        `}
                        onClick={handleLogout}
                    >
                        <LogOut className={`${isNavCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                        {!isNavCollapsed && <span className="font-medium">Logout</span>}
                    </div>
                )}
            </nav>
        </aside>
    );
};

const UserDashboard = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) setIsNavCollapsed(true);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                isNavCollapsed={isNavCollapsed} 
                setIsNavCollapsed={setIsNavCollapsed} 
                isMobile={isMobile} 
            />
            <main className={`
                flex-1 transition-all duration-300 overflow-x-hidden
                ${isMobile ? 'pb-20' : isNavCollapsed ? 'ml-20' : 'ml-64'}
            `}>
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<UserDashboardHome />} />
                        <Route path="/leads" element={<LeadsManagement />} />
                        <Route path="/dm-status" element={<DMStatusDashboard />} />
                        <Route path="/ai-calling-agent/*" element={<AICallingAgent />} />
                        <Route path="/warm-leads" element={<WarmLeadsAndAppointments />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;

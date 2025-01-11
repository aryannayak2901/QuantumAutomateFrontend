import React from 'react';
import { WelcomeMessage, WelcomeBanner, QuickActions, MetricCard, AnalyticsChart, ActivityFeed } from '../../../components/UserDashboardComponents'
import './UserDashboardHome.css';

const metrics = [
    { title: 'Leads Generated', value: '127', trend: '+12%' },
    { title: 'Leads Contacted', value: '89', trend: '+8%' },
    { title: 'Qualified Leads', value: '45', trend: '+15%' },
    { title: 'Appointments Set', value: '23', trend: '+5%' },
];

function UserDashboardHome() {
    return (

        <div className="container">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Metrics Section */}
            <div className="metrics-grid">
                {metrics.map((metric) => (
                    <MetricCard key={metric.title} {...metric} />
                ))}
            </div>

            {/* Quick Actions Section */}
            <QuickActions />

            {/* Main Content Section */}
            <div className="content-grid">
                <ActivityFeed />
                <AnalyticsChart />
            </div>
        </div>
    );
}

export default UserDashboardHome;

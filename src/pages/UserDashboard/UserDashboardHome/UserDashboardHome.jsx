import React from 'react';
import { WelcomeBanner, QuickActions, MetricCard, AnalyticsChart, ActivityFeed } from '../../../components/UserDashboardComponents';

const metrics = [
    { title: 'Leads Generated', value: '127', trend: '+12%' },
    { title: 'Leads Contacted', value: '89', trend: '+8%' },
    { title: 'Qualified Leads', value: '45', trend: '+15%' },
    { title: 'Appointments Set', value: '23', trend: '+5%' },
];

function UserDashboardHome() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Quick Actions */}
            <QuickActions />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric) => (
                    <MetricCard key={metric.title} {...metric} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsChart />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}

export default UserDashboardHome;
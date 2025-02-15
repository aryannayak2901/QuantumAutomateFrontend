import React from 'react';
import { Clock, User, Phone, Calendar } from 'lucide-react';

function ActivityFeed() {
    const activities = [
        { 
            type: 'new_lead',
            icon: User,
            color: 'text-blue-500 bg-blue-100',
            content: 'New lead added: John Smith',
            time: '5 min ago'
        },
        {
            type: 'call_completed',
            icon: Phone,
            color: 'text-green-500 bg-green-100',
            content: 'AI Call completed with Sarah Johnson',
            time: '15 min ago'
        },
        {
            type: 'appointment',
            icon: Calendar,
            color: 'text-purple-500 bg-purple-100',
            content: 'Appointment set with Mike Brown',
            time: '1 hour ago'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-700">{activity.content}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{activity.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActivityFeed;
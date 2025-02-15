import React from 'react';
import { Plus, Phone, BarChart2, Settings } from 'lucide-react';

function QuickActions() {
    const actions = [
        { name: 'Add New Lead', icon: Plus, color: 'bg-blue-500' },
        { name: 'Launch Campaign', icon: Phone, color: 'bg-green-500' },
        { name: 'View Analytics', icon: BarChart2, color: 'bg-purple-500' },
        { name: 'Configure AI', icon: Settings, color: 'bg-orange-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
                <button
                    key={index}
                    className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                    <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6" />
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">{action.name}</span>
                </button>
            ))}
        </div>
    );
}

export default QuickActions;
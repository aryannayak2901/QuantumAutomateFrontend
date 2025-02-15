import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function MetricCard({ title, value, trend }) {
    const isPositive = trend?.includes('+');
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <h3 className="text-gray-600 font-medium">{title}</h3>
                <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {trend}
                </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                <div 
                    className={`h-1.5 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(parseInt(trend))}%` }}
                ></div>
            </div>
        </div>
    );
}

export default MetricCard;
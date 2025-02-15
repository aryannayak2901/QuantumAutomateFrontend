import React from 'react';
import { Line } from 'react-chartjs-2';
import { ArrowUpRight } from 'lucide-react';

function AnalyticsChart() {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Generated Leads',
                data: [65, 59, 80, 81, 56, 95],
                fill: false,
                borderColor: '#0ea5e9',
                tension: 0.4
            },
            {
                label: 'Converted Leads',
                data: [28, 48, 40, 19, 86, 27],
                fill: false,
                borderColor: '#10b981',
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Lead Generation Trends</h2>
                <div className="flex items-center text-sm text-green-500">
                    <span>+12.5%</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
            </div>
            <Line data={data} options={options} />
        </div>
    );
}

export default AnalyticsChart;
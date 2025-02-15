import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';

function WelcomeBanner() {
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'MMMM dd, yyyy'));
    const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(format(new Date(), 'MMMM dd, yyyy'));
            setCurrentTime(format(new Date(), 'HH:mm'));
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-white mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
                    <p className="text-primary-100 text-lg">Here's what's happening with your leads today.</p>
                </div>
                <div className="text-primary-100 text-right">
                    <p className="text-lg font-semibold">{currentDate}</p>
                    <p className="text-2xl font-bold">{currentTime}</p>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBanner
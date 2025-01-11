import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import './WelcomeBanner.css'

function WelcomeBanner() {

    const [currentDate, setCurrentDate] = useState(format(new Date(), 'MMMM dd, yyyy'));
    const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(format(new Date(), 'MMMM dd, yyyy'));
            setCurrentTime(format(new Date(), 'HH:mm'));
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [])


    return (
        <div className="welcome-banner">
            <div>
                <h1>Welcome back, John!</h1>
                <p>Here's what's happening with your leads today.</p>
            </div>
            <div>
                <p>{currentDate}</p>
                <p>{currentTime}</p>
            </div>
        </div>
    );
}

export default WelcomeBanner
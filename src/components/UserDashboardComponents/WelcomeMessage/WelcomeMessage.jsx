import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import './WelcomeMessage.css'

const WelcomeMessage = () => {

    const [currentDate, setCurrentDate] = useState();
    const [currentTime, setCurrentTime] = useState();

    useEffect(() => {
        setCurrentDate(format(new Date(), 'MMMM dd, yyyy'));
        setCurrentTime(format(new Date(), 'HH:mm'));
    }, [])


    return (
        <div className="welcome-message-container">
            <div className="message">
                <h2>Welcome back, John!</h2>
                <p>Here's what's happening with your leads today.</p>
            </div>
            <div className="date-time">
                <p>{currentDate}</p>
                <p>{currentTime}</p>
            </div>
        </div>
    )
}

export default WelcomeMessage
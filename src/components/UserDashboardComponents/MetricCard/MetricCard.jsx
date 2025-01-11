import React from 'react';
import './MetricCard.css'

function MetricCard({ title, value, trend }) {
    return (
        <div className="metric-card">
            <h2>{title}</h2>
            <p>{value}</p>
            <p>{trend}</p>
        </div>
    );
}

export default MetricCard;
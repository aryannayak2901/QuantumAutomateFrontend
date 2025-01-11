import React from 'react';
import './QuickActions.css'

function QuickActions() {
    const actions = ['Add New Lead', 'Launch Campaign', 'View Analytics', 'Configure AI'];

    return (
        <div className="quick-actions">
            {actions.map((action, index) => (
                <div key={index} className="quick-action">
                    {action}
                </div>
            ))}
        </div>
    );
}

export default QuickActions
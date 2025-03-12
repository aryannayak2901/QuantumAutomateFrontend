import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const LeadList = ({ leads }) => {
    const history = useHistory(); // Initialize history for navigation

    const handleLeadClick = (leadId) => {
        history.push(`/leads/${leadId}`); // Redirect to the lead detail page
    };

    return (
        <div>
            {leads.map((lead) => (
                <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div onClick={() => handleLeadClick(lead.id)}>
                        <h3>{lead.name}</h3>
                        <p>{lead.phone_number}</p>
                    </div>
                    <button onClick={() => handleLeadClick(lead.id)} style={{ marginLeft: '10px' }}>
                        View Details
                    </button>
                </div>
            ))}
        </div>
    );
};

export default LeadList; 
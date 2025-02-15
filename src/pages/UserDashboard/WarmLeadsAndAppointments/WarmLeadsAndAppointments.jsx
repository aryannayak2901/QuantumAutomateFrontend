import React from "react";
import { Tabs } from "antd";
import WarmLeads from "../WarmLeads/WarmLeads";
import Appointments from "../AICallingAgent/Appointments/Appointments";
// import "./WarmLeadsAndAppointments.css";

const WarmLeadsAndAppointments = () => {
    return (
        <div className="warm-leads-appointments-container">
            <div className="header">
                <h1>Warm Leads & Appointments</h1>
                <p>Manage your leads and appointments efficiently.</p>
            </div>
            <div className="tabs-container">
                <Tabs
                    defaultActiveKey="1"
                    size="large"
                    type="card"
                    items={[
                        {
                            key: "1",
                            label: "Warm Leads",
                            children: <WarmLeads />,
                        },
                        {
                            key: "2",
                            label: "Appointments",
                            children: <Appointments />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default WarmLeadsAndAppointments;

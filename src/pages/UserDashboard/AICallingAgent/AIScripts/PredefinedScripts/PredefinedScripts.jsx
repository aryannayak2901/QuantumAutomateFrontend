import React, { useState, useEffect } from "react";
import { Table, Button, Input, Card } from "antd";
import axios from "axios";

const PredefinedScripts = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchScripts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/predefined-scripts");
            setScripts(response.data);
        } catch (error) {
            console.error("Error fetching scripts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScripts();
    }, []);

    const filteredScripts = scripts.filter((script) =>
        script.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Predefined Scripts</h2>
            <Input
                placeholder="Search scripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px" }}
            />
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {filteredScripts.map((script) => (
                    <Card key={script.id} title={script.name} bordered style={{ width: 300 }}>
                        <p>{script.description}</p>
                        <Button type="primary">Use Script</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PredefinedScripts;

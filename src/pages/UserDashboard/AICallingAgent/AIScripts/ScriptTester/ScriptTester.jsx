import React, { useState } from "react";
import { Input, Button } from "antd";
import axios from "axios";

const ScriptTester = () => {
    const [script, setScript] = useState("");
    const [testInput, setTestInput] = useState({ name: "", date: "" });
    const [response, setResponse] = useState("");

    const handleTestScript = async () => {
        try {
            const result = await axios.post("http://localhost:3000/test-script", {
                script,
                variables: testInput,
            });
            setResponse(result.data.response);
        } catch (error) {
            console.error("Error testing script:", error);
        }
    };

    return (
        <div>
            <h2>Test AI Script</h2>
            <Input.TextArea
                rows={4}
                placeholder="Enter script content..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                style={{ marginBottom: "10px" }}
            />
            <Input
                placeholder="Name"
                value={testInput.name}
                onChange={(e) => setTestInput({ ...testInput, name: e.target.value })}
                style={{ marginBottom: "10px" }}
            />
            <Input
                placeholder="Date"
                value={testInput.date}
                onChange={(e) => setTestInput({ ...testInput, date: e.target.value })}
                style={{ marginBottom: "10px" }}
            />
            <Button type="primary" onClick={handleTestScript} style={{ marginBottom: "10px" }}>
                Test Script
            </Button>
            {response && <div style={{ marginTop: "20px", fontWeight: "bold" }}>Response: {response}</div>}
        </div>
    );
};

export default ScriptTester;

import React, { useState, useEffect } from "react";
import { Input, Button, Table } from "antd";
import axios from "axios";

const CustomScripts = () => {
    const [scripts, setScripts] = useState([]);
    const [newScript, setNewScript] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCustomScripts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/custom-scripts");
            setScripts(response.data);
        } catch (error) {
            console.error("Error fetching custom scripts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!newScript) {
            return alert("Please enter script content.");
        }
        try {
            await axios.post("http://localhost:3000/custom-scripts", { content: newScript });
            fetchCustomScripts();
            setNewScript("");
        } catch (error) {
            console.error("Error uploading script:", error);
        }
    };

    useEffect(() => {
        fetchCustomScripts();
    }, []);

    return (
        <div>
            <h2>Custom Scripts</h2>
            <Input.TextArea
                rows={15}
                placeholder="Enter custom script..."
                value={newScript}
                onChange={(e) => setNewScript(e.target.value)}
                style={{ marginBottom: "10px" }}
            />
            <Button type="primary" onClick={handleUpload} style={{ marginBottom: "20px" }}>
                Upload Script
            </Button>
            <Table
                dataSource={scripts}
                columns={[
                    { title: "Content", dataIndex: "content", key: "content", ellipsis: true },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <Button type="link" danger onClick={() => console.log("Delete script")}>
                                Delete
                            </Button>
                        ),
                    },
                ]}
                rowKey="id"
            />
        </div>
    );
};

export default CustomScripts;

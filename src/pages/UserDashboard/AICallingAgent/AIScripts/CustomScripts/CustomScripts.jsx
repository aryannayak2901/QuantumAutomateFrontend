import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";

const CustomScripts = () => {
    const [scripts, setScripts] = useState([]);
    const [newScript, setNewScript] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingScript, setEditingScript] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        fetchCustomScripts();
    }, []);

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
        if (!newScript.trim()) {
            alert("Please enter script content.");
            return;
        }
        try {
            await axios.post("http://localhost:3000/custom-scripts", { content: newScript });
            fetchCustomScripts();
            setNewScript("");
        } catch (error) {
            console.error("Error uploading script:", error);
        }
    };

    const handleEdit = (script) => {
        setEditingScript(script.id);
        setEditedContent(script.content);
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`http://localhost:3000/custom-scripts/${id}`, { content: editedContent });
            fetchCustomScripts();
            setEditingScript(null);
        } catch (error) {
            console.error("Error updating script:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/custom-scripts/${id}`);
            fetchCustomScripts();
        } catch (error) {
            console.error("Error deleting script:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Custom Scripts</h2>
                
                {/* Text Area for Adding New Scripts */}
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    placeholder="Enter custom script..."
                    value={newScript}
                    onChange={(e) => setNewScript(e.target.value)}
                ></textarea>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Upload Script
                </button>
            </div>

            {/* Script Table */}
            <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Uploaded Scripts</h3>

                {loading ? (
                    <p className="text-center text-gray-500">Loading scripts...</p>
                ) : (
                    <Table
                        dataSource={scripts}
                        columns={[
                            {
                                title: "Content",
                                dataIndex: "content",
                                key: "content",
                                render: (text, record) =>
                                    editingScript === record.id ? (
                                        <textarea
                                            className="w-full p-2 border rounded-md"
                                            rows={3}
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                        />
                                    ) : (
                                        <span className="block overflow-hidden overflow-ellipsis">{text}</span>
                                    ),
                            },
                            {
                                title: "Actions",
                                key: "actions",
                                render: (_, record) => (
                                    <div className="flex gap-2">
                                        {editingScript === record.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(record.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(record)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        bordered
                    />
                )}
            </div>
        </div>
    );
};

export default CustomScripts;

import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Modal, Spin, message, Select, Typography } from "antd";
import { PhoneOutlined, DeleteOutlined, EyeOutlined, AudioOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const CallLogs = () => {
    const [callLogs, setCallLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [campaignNames, setCampaignNames] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedCallLog, setSelectedCallLog] = useState(null);
    const [transcriptions, setTranscriptions] = useState({});
    const [loadingTranscription, setLoadingTranscription] = useState(false);

    // Fetch call logs and extract unique campaigns
    const fetchCallLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/CallLogs"); // Replace with your backend endpoint
            const logs = response.data;

            // Extract unique campaign names
            const campaigns = Array.from(new Set(logs.map((log) => log.campaignName))).filter(Boolean);
            setCallLogs(logs);
            setFilteredLogs(logs);
            setCampaignNames(campaigns);
        } catch (error) {
            console.error("Error fetching call logs:", error);
            message.error("Failed to fetch call logs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Handle campaign selection
    const handleCampaignChange = (campaign) => {
        setSelectedCampaign(campaign);
        if (!campaign) {
            setFilteredLogs(callLogs); // Show all logs if no campaign is selected
        } else {
            setFilteredLogs(callLogs.filter((log) => log.campaignName === campaign));
        }
    };

    // Handle view button click
    const handleViewClick = (record) => {
        setSelectedCallLog(record);
        setViewModalVisible(true);
    };

    // Handle delete recording
    const handleDeleteRecording = async () => {
        if (!selectedCallLog || !selectedCallLog.callRecording) {
            message.error("No recording available to delete.");
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/CallLogs/${selectedCallLog.id}/recording`);
            message.success("Recording deleted successfully!");
            setSelectedCallLog({ ...selectedCallLog, callRecording: null });
        } catch (error) {
            console.error("Error deleting recording:", error);
            message.error("Failed to delete recording. Please try again later.");
        }
    };

    // Handle delete call log
    const handleDeleteCallLog = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/CallLogs/${id}`);
            message.success("Call log deleted successfully!");
            fetchCallLogs(); // Refresh call logs
        } catch (error) {
            console.error("Error deleting call log:", error);
            message.error("Failed to delete call log. Please try again later.");
        }
    };

    // Fetch transcription for a specific call
    const fetchTranscription = async (callSid) => {
        setLoadingTranscription(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/twilio/call-transcriptions/${callSid}/`);
            setTranscriptions(prev => ({
                ...prev,
                [callSid]: response.data.transcription
            }));
        } catch (error) {
            console.error("Error fetching transcription:", error);
            message.error("Failed to fetch call transcription");
        } finally {
            setLoadingTranscription(false);
        }
    };

    useEffect(() => {
        fetchCallLogs();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <strong>{text}</strong>,
            ellipsis: true, // Truncate text for mobile
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => (
                <a href={`tel:${text}`}>
                    <PhoneOutlined /> {text}
                </a>
            ),
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "Answered"
                        ? "green"
                        : status === "Missed"
                            ? "red"
                            : "orange";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Campaign Name",
            dataIndex: "campaignName",
            key: "campaignName",
            render: (campaignName) => (
                <span style={{ fontStyle: "italic" }}>{campaignName || "N/A"}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Outcome",
            dataIndex: "outcome",
            key: "outcome",
            render: (outcome) => (
                <span style={{ fontStyle: "italic" }}>{outcome}</span>
            ),
            ellipsis: true,
        },
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (timestamp) => (
                <span style={{ color: "#555", fontSize: "12px" }}>{timestamp}</span>
            ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration) => `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
        },
        {
            title: "Recording",
            key: "recording",
            render: (_, record) => (
                record.recordingUrl && (
                    <Button 
                        type="link" 
                        icon={<AudioOutlined />}
                        onClick={() => handleViewClick(record)}
                    >
                        Listen
                    </Button>
                )
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewClick(record)}>
                        View
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCallLog(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
            width: 150,
            fixed: "right",
        },
    ];

    const ViewCallLogModal = () => (
        <Modal
            title="Call Log Details"
            open={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
            footer={null}
            width={700}
        >
            {selectedCallLog && (
                <div className="space-y-4">
                    <p>
                        <strong>Name:</strong> {selectedCallLog.name}
                    </p>
                    <p>
                        <strong>Phone:</strong> {selectedCallLog.phone}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <Tag
                            color={
                                selectedCallLog.status === "Answered"
                                    ? "green"
                                    : selectedCallLog.status === "Missed"
                                        ? "red"
                                        : "orange"
                            }
                        >
                            {selectedCallLog.status}
                        </Tag>
                    </p>
                    <p><strong>Campaign Name:</strong> {selectedCallLog.campaignName || "N/A"}</p>
                    <p>
                        <strong>Timestamp:</strong> {selectedCallLog.timestamp}
                    </p>
                    <p>
                        <strong>Outcome:</strong> {selectedCallLog.outcome}
                    </p>
                    {selectedCallLog.status === "Answered" && selectedCallLog.callRecording ? (
                        <div>
                            <strong>Recording:</strong>
                            <audio
                                controls
                                src={selectedCallLog.callRecording}
                                style={{ marginTop: "10px", width: "100%" }}
                            />
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteRecording}
                            >
                                Delete Recording
                            </Button>
                        </div>
                    ) : (
                        <p>
                            <strong>Note:</strong> {selectedCallLog.status}
                        </p>
                    )}
                    
                    {/* Transcription Section */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Transcription</h3>
                        {loadingTranscription ? (
                            <Spin />
                        ) : transcriptions[selectedCallLog.callSid] ? (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <Text>{transcriptions[selectedCallLog.callSid]}</Text>
                            </div>
                        ) : (
                            <Button 
                                type="primary" 
                                onClick={() => fetchTranscription(selectedCallLog.callSid)}
                            >
                                Load Transcription
                            </Button>
                        )}
                    </div>

                    {/* Recording Player */}
                    {selectedCallLog.recordingUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Recording</h3>
                            <audio
                                controls
                                src={selectedCallLog.recordingUrl}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );

    return (
        <div>
            <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Call Logs</h2>

            {/* Campaign Filter */}
            <div style={{ marginBottom: 20 }}>
                <Select
                    showSearch
                    value={selectedCampaign}
                    placeholder="Filter by Campaign Name"
                    onChange={handleCampaignChange}
                    style={{ width: "100%" }}
                    allowClear
                >
                    {campaignNames.map((campaign) => (
                        <Option key={campaign} value={campaign}>
                            {campaign}
                        </Option>
                    ))}
                </Select>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={filteredLogs}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        pageSize: 5,
                    }}
                    bordered
                    scroll={{
                        x: 800, // Enables horizontal scrolling on small viewports
                    }}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                />
            )}

            <ViewCallLogModal />
        </div>
    );
};

export default CallLogs;

import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Progress,
    Spin,
    message,
    Button,
    Table,
    Input,
    Modal,
    Radio,
    Switch,
    Select,
} from "antd";
import axios from "axios";

const { Option } = Select;

const AICallingAgentHome = () => {
    const [metrics, setMetrics] = useState({
        totalCalls: 0,
        answeredCalls: 0,
        missedCalls: 0,
        campaignProgress: 0,
    });
    const [loading, setLoading] = useState(false);
    const [systemNumbers, setSystemNumbers] = useState([]);
    const [personalNumbers, setPersonalNumbers] = useState([]);
    const [assignedSystemNumber, setAssignedSystemNumber] = useState(null);
    const [newPersonalNumber, setNewPersonalNumber] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [callSettings, setCallSettings] = useState({
        incomingCallHandling: "forward",
        testCallStatus: null,
    });

    // Fetch metrics and phone numbers
    useEffect(() => {
        fetchMetrics();
        fetchNumbers();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/metrics");
            setMetrics(response.data);
        } catch (error) {
            console.error("Error fetching dashboard metrics:", error);
            message.error("Failed to fetch dashboard metrics. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchNumbers = async () => {
        try {
            const systemResponse = await axios.get("http://localhost:3000/systemNumbers");
            const personalResponse = await axios.get("http://localhost:3000/personalNumbers");
            setSystemNumbers(systemResponse.data);
            setPersonalNumbers(personalResponse.data);
            setAssignedSystemNumber(systemResponse.data[0]); // Default assigned number
        } catch (error) {
            console.error("Error fetching numbers:", error);
            message.error("Failed to fetch phone numbers. Please try again.");
        }
    };

    const handleAssignSystemNumber = async (number) => {
        try {
            await axios.post("http://localhost:3000/assignedSystemNumber", { number });
            setAssignedSystemNumber(number);
            message.success(`System number ${number} assigned successfully!`);
        } catch (error) {
            console.error("Error assigning system number:", error);
            message.error("Failed to assign system number.");
        }
    };

    const handleAddPersonalNumber = async () => {
        if (!newPersonalNumber) {
            message.error("Please enter a valid phone number.");
            return;
        }
        try {
            await axios.post("http://localhost:3000/personalNumbers", { number: newPersonalNumber, verified: false });
            setPersonalNumbers([...personalNumbers, { number: newPersonalNumber, verified: false }]);
            setNewPersonalNumber('');
            message.success("Personal number added successfully. Verification pending.");
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error adding personal number:", error);
            message.error("Failed to add personal number.");
        }
    };

    const handleVerifyPersonalNumber = async (number) => {
        try {
            // Update the verification status in the backend
            console.log(number);
            
            await axios.put(`http://localhost:3000/personalNumbers/${number}`, { verified: true });

            // Update the state to reflect the change
            setPersonalNumbers((prev) =>
                prev.map((num) =>
                    num.number === number ? { ...num, verified: true } : num
                )
            );

            message.success(`Number ${number} verified successfully!`);
        } catch (error) {
            console.error("Error verifying personal number:", error);
            message.error("Failed to verify the number. Please try again.");
        }
    };


    const handleCallSettingChange = (e) => {
        setCallSettings({ ...callSettings, incomingCallHandling: e.target.value });
    };

    const handleTestCall = async () => {
        try {
            const response = await axios.post("http://localhost:3000/testCall", {});
            setCallSettings({ ...callSettings, testCallStatus: response.data.status });
            message.success("Test call completed successfully!");
        } catch (error) {
            console.error("Error making test call:", error);
            message.error("Test call failed.");
        }
    };

    return (
        <div>
            <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>AI Calling Agent Dashboard</h2>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* Metrics Section */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title="Total Calls Today" bordered={false} style={{ textAlign: "center" }}>
                                <h2>{metrics.totalCalls}</h2>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title="Answered Calls" bordered={false} style={{ textAlign: "center" }}>
                                <h2>{metrics.answeredCalls}</h2>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title="Missed Calls" bordered={false} style={{ textAlign: "center" }}>
                                <h2>{metrics.missedCalls}</h2>
                            </Card>
                        </Col>
                    </Row>
                    <Progress percent={metrics.campaignProgress} status="active" />
                </>
            )}

            {/* System Number Management */}
            <Row>
                <Col xs={24}>
                    <Card title="System Numbers">
                        <Select
                            style={{ width: "100%", marginBottom: "10px" }}
                            placeholder="Select a system number"
                            value={assignedSystemNumber}
                            onChange={handleAssignSystemNumber}
                        >
                            {systemNumbers.map((num) => (
                                <Option key={num.id} value={num.number}>
                                    {num.number}
                                </Option>
                            ))}
                        </Select>
                        <Button type="primary">Update System Number</Button>
                    </Card>
                </Col>
            </Row>

            {/* Personal Numbers */}
            <Row>
                <Col xs={24}>
                    <Card title="Personal Numbers">
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>
                            Add Personal Number
                        </Button>
                        <Table
                            dataSource={personalNumbers.map((num) => ({
                                key: num.number,
                                number: num.number,
                                verified: num.verified ? "Verified" : "Pending",
                            }))}
                            columns={[
                                { title: "Number", dataIndex: "number", key: "number" },
                                { title: "Status", dataIndex: "verified", key: "verified" },
                                {
                                    title: "Actions",
                                    key: "actions",
                                    render: (_, record) =>
                                        record.verified === "Pending" && (
                                            <Button onClick={() => handleVerifyPersonalNumber(record.number)}>
                                                Verify
                                            </Button>
                                        ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Call Settings */}
            <Card title="Call Settings">
                <Radio.Group
                    onChange={handleCallSettingChange}
                    value={callSettings.incomingCallHandling}
                >
                    <Radio value="forward">Forward to Personal Number</Radio>
                    <Radio value="ai">Handle via AI (Voice Bot)</Radio>
                </Radio.Group>
                <Button type="primary" onClick={handleTestCall}>
                    Test Outbound Call
                </Button>
            </Card>

            {/* Add Personal Number Modal */}
            <Modal
                title="Add Personal Number"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddPersonalNumber}
            >
                <Input
                    placeholder="Enter your personal phone number"
                    value={newPersonalNumber}
                    onChange={(e) => setNewPersonalNumber(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default AICallingAgentHome;

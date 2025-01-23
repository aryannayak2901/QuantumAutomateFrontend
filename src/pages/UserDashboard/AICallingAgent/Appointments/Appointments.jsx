import React, { useEffect, useState } from "react";
import {
    Table,
    Tag,
    Calendar,
    Badge,
    Spin,
    message,
    Modal,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    TimePicker,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const Appointments = () => {
    const [viewMode, setViewMode] = useState("table");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/Appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            message.error("Failed to fetch appointments. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewAppointment = (appointment) => {
        // Ensure that date and time are properly formatted
        const formattedAppointment = {
            ...appointment,
            date: appointment.date ? moment(appointment.date, "YYYY-MM-DD") : null,
            time: appointment.time ? moment(appointment.time, "HH:mm") : null
        };

        setSelectedAppointment(formattedAppointment);
        setIsModalVisible(true);
    };


    const handleSaveChanges = async (updatedAppointment) => {
        try {
            // Send updated data to the backend
            await axios.put(
                `http://localhost:3000/Appointments/${updatedAppointment.id}`,
                updatedAppointment
            );
            // Update the frontend state
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt.id === updatedAppointment.id ? updatedAppointment : appt
                )
            );
            message.success("Appointment updated successfully!");
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            message.error("Failed to update appointment.");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const columns = [
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            key: "date",
            render: (text) => <span style={{ color: "#555" }}>{text}</span>,
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            render: (text) => (
                <span style={{ fontStyle: "italic", color: "#888" }}>{text}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "Scheduled"
                        ? "blue"
                        : status === "Completed"
                            ? "green"
                            : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewAppointment(record)}>
                    View/Edit
                </Button>
            ),
        },
    ];

    const getListData = (value) => {
        const date = value.format("YYYY-MM-DD");
        return appointments
            .filter((appointment) => appointment.date.includes(date))
            .map((appointment) => ({
                type:
                    appointment.status === "Scheduled"
                        ? "success"
                        : appointment.status === "Completed"
                            ? "processing"
                            : "error",
                content: `${appointment.customer}: ${appointment.reason}`,
            }));
    };

    const cellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul style={{ padding: 0, listStyle: "none" }}>
                {listData.map((item, index) => (
                    <li key={index}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Appointments</h2>
            <div style={{ marginBottom: "20px" }}>
                <button
                    style={{
                        padding: "10px 15px",
                        marginRight: "10px",
                        borderRadius: "5px",
                        backgroundColor: viewMode === "table" ? "#1890ff" : "#f0f2f5",
                        color: viewMode === "table" ? "white" : "#1890ff",
                        border: "1px solid #1890ff",
                    }}
                    onClick={() => setViewMode("table")}
                >
                    Table View
                </button>
                <button
                    style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        backgroundColor: viewMode === "calendar" ? "#1890ff" : "#f0f2f5",
                        color: viewMode === "calendar" ? "white" : "#1890ff",
                        border: "1px solid #1890ff",
                    }}
                    onClick={() => setViewMode("calendar")}
                >
                    Calendar View
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Spin size="large" />
                </div>
            ) : viewMode === "table" ? (
                <Table
                    dataSource={appointments}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        pageSize: 5,
                    }}
                    bordered
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        overflowX: "auto",
                    }}
                />
            ) : (
                <Calendar cellRender={cellRender} />
            )}

            {/* View/Edit Modal */}
            <Modal
                title="Appointment Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedAppointment && (
                    <Form
                        layout="vertical"
                        initialValues={selectedAppointment}
                        onFinish={handleSaveChanges}
                    >
                        <Form.Item label="Customer" name="customer">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Date" name="date">
                            <DatePicker
                                style={{ width: "100%" }}
                                value={selectedAppointment && moment(selectedAppointment.date, "YYYY-MM-DD")}
                                onChange={(date) => {
                                    // Ensure date is valid
                                    if (date && date.isValid()) {
                                        handleSaveChanges({ ...selectedAppointment, date });
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Time" name="time">
                            <TimePicker
                                style={{ width: "100%" }}
                                value={selectedAppointment && moment(selectedAppointment.time, "HH:mm")}
                                onChange={(time) => {
                                    // Ensure time is valid
                                    if (time && time.isValid()) {
                                        handleSaveChanges({ ...selectedAppointment, time });
                                    }
                                }}
                            />
                        </Form.Item>


                        <Form.Item label="Reason" name="reason">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Status" name="status">
                            <Select>
                                <Option value="Scheduled">Scheduled</Option>
                                <Option value="Completed">Completed</Option>
                                <Option value="Canceled">Canceled</Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default Appointments;

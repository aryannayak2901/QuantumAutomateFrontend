import React, { useState } from 'react';
import { Modal, DatePicker, TimePicker, Select, Button, message, Form } from 'antd';

const { Option } = Select;

const SetAppointmentModal = ({ visible, onClose, onSave }) => {
    const [form] = Form.useForm();

    const handleSave = () => {
        form
            .validateFields()
            .then((values) => {
                const appointmentData = {
                    ...values,
                    date: values.date.format('YYYY-MM-DD'),
                    time: values.time.format('HH:mm'),
                };
                onSave(appointmentData);
                form.resetFields();
            })
            .catch((info) => {
                console.error('Validation Failed:', info);
            });
    };

    return (
        <Modal
            title="Set Appointment"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save Appointment
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Please select a date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: true, message: 'Please select a time!' }]}
                >
                    <TimePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="reason"
                    label="Reason"
                    rules={[{ required: true, message: 'Please select a reason!' }]}
                >
                    <Select placeholder="Select a reason">
                        <Option value="Consultation">Consultation</Option>
                        <Option value="Follow-Up">Follow-Up</Option>
                        <Option value="Demo">Demo</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SetAppointmentModal;

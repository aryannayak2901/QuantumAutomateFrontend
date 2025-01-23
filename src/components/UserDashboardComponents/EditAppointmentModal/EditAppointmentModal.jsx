import { Form, Modal, Button, DatePicker, TimePicker, Select } from 'antd';
import moment from 'moment'

const EditAppointmentModal = ({ visible, onClose, onSave, appointment }) => {
    const [form] = Form.useForm();

    const handleSave = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedAppointment = {
                    ...values,
                    date: values.date.format('YYYY-MM-DD'),
                    time: values.time.format('HH:mm'),
                };
                onSave(updatedAppointment);
                form.resetFields();
            })
            .catch((info) => {
                console.error('Validation Failed:', info);
            });
    };

    return (
        <Modal
            title="Edit Appointment"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save Changes
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    date: appointment?.date ? moment(appointment.date, 'YYYY-MM-DD') : null,
                    time: appointment?.time ? moment(appointment.time, 'HH:mm') : null,
                    reason: appointment?.reason,
                }}
            >
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
                        <Select.Option value="Consultation">Consultation</Select.Option>
                        <Select.Option value="Follow-Up">Follow-Up</Select.Option>
                        <Select.Option value="Demo">Demo</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditAppointmentModal;

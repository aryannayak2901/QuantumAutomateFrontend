import API from '../api';

const ExotelService = {
    getStatus: async () => {
        try {
            const response = await API.get('users/exotel-status/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get Exotel status');
        }
    },

    createSubaccount: async () => {
        try {
            const response = await API.post('users/create-exotel-subaccount/', {});
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to create Exotel subaccount');
        }
    },

    verifyPhone: async (phoneNumber) => {
        try {
            const response = await API.post('users/verify-phone/', {
                phone_number: phoneNumber
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to verify phone number');
        }
    }
};

export default ExotelService; 
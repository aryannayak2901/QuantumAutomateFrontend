import API from '../api';

const ExotelService = {
    enableExotel: async () => {
        try {
            const response = await API.post('users/exotel/enable/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to enable Exotel');
        }
    },

    disableExotel: async () => {
        try {
            const response = await API.post('users/exotel/disable/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to disable Exotel');
        }
    },

    getStatus: async () => {
        try {
            const response = await API.get('users/exotel-status/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get Exotel status');
        }
    }
};

export default ExotelService;
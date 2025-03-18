import axios from 'axios';

// Create an Axios instance with the base API URL
const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 30000,
});

// List of public endpoints (No Authentication required)
const publicEndpoints = [
    "users/register/",
    "users/verify-otp/",
    "users/login/",
    "users/facebook/login/",
    "users/resend-otp/",
    "users/refresh-token/",
    "users/auth/forgot-password/"
];

// List of endpoints that might need longer timeout
const longOperationEndpoints = [
    "users/create-twilio-subaccount/",
    "users/twilio-status/"
];

// Add request interceptor to add auth token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('accessToken', access);

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/signin';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Logout function
export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await API.post('users/logout/', { 
                refresh_token: refreshToken 
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
        }
    } catch (error) {
        console.error("Logout request failed:", error.response?.data || error.message);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "/signin";
    }
};

export default API;

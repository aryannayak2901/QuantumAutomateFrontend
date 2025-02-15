import axios from 'axios';

// Create an Axios instance with the base API URL
const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 30000, // 30 second timeout for Twilio operations which might take longer
});

// List of public endpoints (No Authentication required)
const publicEndpoints = [
    "users/register/",
    "users/verify-otp/",
    "users/login/",
    "users/facebook/login/",
    "users/resend-otp/",
    "users/refresh-token/"
];

// List of endpoints that might need longer timeout
const longOperationEndpoints = [
    "users/create-twilio-subaccount/",
    "users/twilio-status/"
];

// Automatically add Authorization header for protected routes
API.interceptors.request.use((config) => {
    // Adjust timeout for long-running operations
    if (longOperationEndpoints.some(endpoint => config.url.includes(endpoint))) {
        config.timeout = 30000; // 30 seconds
    } else {
        config.timeout = 10000; // 10 seconds default
    }

    const token = localStorage.getItem('accessToken');

    // Attach Authorization header ONLY for protected endpoints
    if (token && !publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle responses and errors
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle specific Twilio-related errors
        if (error.response?.data?.error) {
            const errorMessage = error.response.data.error;
            if (errorMessage.includes("Insufficient Twilio credits")) {
                console.error("Twilio credits depleted");
            }
        }

        // If the error is 401 Unauthorized and it's NOT a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Attempt to get a new access token
                    // Update this line in the refresh token section
                    const refreshResponse = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = refreshResponse.data.access;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Update the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return API(originalRequest); // Retry the request with the new token
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    await logoutUser(); // Log out if refresh fails
                }
            } else {
                await logoutUser(); // Log out if no refresh token
            }
        }

        // Handle timeout errors specifically
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                response: {
                    data: {
                        error: 'The request timed out. Please try again.'
                    }
                }
            });
        }

        return Promise.reject(error);
    }
);

// Logout function (Clears tokens & redirects to signin)
export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            await API.post('users/logout/', { refresh_token: refreshToken });
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

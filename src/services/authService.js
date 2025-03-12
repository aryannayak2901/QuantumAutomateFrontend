import axios from 'axios';

const BASE_URL = 'http://localhost:8000';  // Django development server

// Create axios instance with consistent configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a secondary client just for token refresh to avoid circular dependencies
const tokenClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to retrieve tokens, for debugging
const checkStoredTokens = () => {
    console.log('----------- DEBUG TOKEN INFO -----------');
    console.log('Access Token:', localStorage.getItem('accessToken')?.substring(0, 15) + '...');
    console.log('Refresh Token:', localStorage.getItem('refreshToken')?.substring(0, 15) + '...');
    console.log('User:', localStorage.getItem('user') ? 'Present' : 'Not found');
};

// Helper function to clear auth data
const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
    // Always try to add the token if it exists
    const token = localStorage.getItem('accessToken');
    
    if (token) {
        console.log('Adding token to request');
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log('No token available for request');
    }
    
    return config;
});

// Handle token refresh on 401 responses
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Log full details of the error for debugging
        console.error('API Request Failed:', {
            status: error.response?.status,
            data: error.response?.data,
            url: originalRequest?.url,
            method: originalRequest?.method
        });
        
        checkStoredTokens();
        
        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Received 401, attempting to refresh token');
            originalRequest._retry = true;
            
            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.log('No refresh token, cannot refresh');
                    clearAuthData();
                    return Promise.reject(error);
                }
                
                // Use specific Django REST Framework JWT endpoint for refresh
                const tokenResponse = await tokenClient.post('/api/auth/token/refresh/', {
                    refresh: refreshToken
                });
                
                if (tokenResponse.data.access) {
                    console.log('Token refreshed successfully');
                    
                    // Store the new token
                    localStorage.setItem('accessToken', tokenResponse.data.access);
                    
                    // Update headers and retry the original request
                    originalRequest.headers.Authorization = `Bearer ${tokenResponse.data.access}`;
                    console.log('Retrying original request with new token');
                    return apiClient(originalRequest);
                } else {
                    console.log('Token refresh response did not contain access token', tokenResponse.data);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
                // Clear auth data on failed refresh
                clearAuthData();
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        console.log('Attempting login with:', credentials.email);
        // Use the proper backend endpoint for login
        const response = await axios.post(`${BASE_URL}/api/auth/login/`, credentials);
        
        console.log('Login response:', response.data);
        
        // Backend returns token and refresh in different keys
        if (response.data.token && response.data.refresh) {
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refresh);
            
            // Store user data
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            checkStoredTokens();
        } else {
            console.warn('Login response missing expected token format:', response.data);
        }
        
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Login failed. Please check your credentials and try again.' };
    }
};

export const getProfile = async () => {
    try {
        console.log('Fetching user profile');
        
        // Check if we have user data in localStorage first
        const cachedUserData = localStorage.getItem('user');
        if (cachedUserData) {
            console.log('Found cached user data, returning it');
            const userData = JSON.parse(cachedUserData);
            return { user: userData };
        }
        
        // Try the API call if no cached data
        try {
            // Use the correct profile endpoint
            const response = await apiClient.get('/api/auth/profile/');
            console.log('Profile response:', response.data);
            
            // Format the response to match expected structure
            const profileData = {
                user: response.data
            };
            
            return profileData;
        } catch (error) {
            // If the profile endpoint fails, we can still consider the user authenticated
            // based on valid tokens, just without profile details
            console.error('Profile fetch from API failed, using minimal user data');
            
            // Construct minimal user data from JWT if possible
            const token = localStorage.getItem('accessToken');
            if (token) {
                // Extract user info from JWT if possible (token is in format xxx.yyy.zzz)
                try {
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const tokenPayload = JSON.parse(atob(tokenParts[1]));
                        console.log('Extracted user data from token:', tokenPayload);
                        
                        // Create minimal user object from token
                        const minimalUser = {
                            email: tokenPayload.email || tokenPayload.sub || 'user@example.com',
                            id: tokenPayload.user_id || tokenPayload.sub || 'unknown'
                        };
                        
                        // Save this minimal data for future use
                        localStorage.setItem('user', JSON.stringify(minimalUser));
                        
                        return { user: minimalUser };
                    }
                } catch (jwtError) {
                    console.error('Failed to parse JWT token:', jwtError);
                }
            }
            
            // Last resort: Create a minimal placeholder user object
            const placeholderUser = { email: 'authenticated@user.com', id: 'authenticated' };
            localStorage.setItem('user', JSON.stringify(placeholderUser));
            return { user: placeholderUser };
        }
    } catch (error) {
        console.error('Profile fetch completely failed:', error);
        throw error;
    }
};

export const signup = async (userData) => {
    try {
        // Format the data to match backend expectations
        const formattedData = {
            email: userData.email,
            password: userData.password,
            password2: userData.confirmPassword,
            name: userData.fullName || userData.name || '',
            business_type: userData.business_type || 'ecommerce',
            phone: userData.phone || ''
        };
        
        console.log('Sending registration data to backend:', formattedData);
        const response = await axios.post(`${BASE_URL}/api/auth/register/`, formattedData);
        console.log('Registration response from backend:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error);
        throw error.response?.data || { message: 'Signup failed' };
    }
};

export const logout = async () => {
    try {
        // Call logout endpoint if token exists
        const token = localStorage.getItem('accessToken');
        if (token) {
            await apiClient.post('/api/auth/logout/');
        }
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
    } finally {
        // Always clear local data
        clearAuthData();
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/password/reset/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to send reset instructions' };
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/password/reset/confirm/`, {
            token,
            new_password: newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Password reset failed' };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put('/api/auth/profile/', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update profile' };
    }
};

export const verifyEmail = async (email, otp) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/verify-email/`, { 
            email, 
            otp 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Email verification failed' };
    }
};

export const resendVerification = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/resend-verification/`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to resend verification email' };
    }
};

export const googleLogin = async (token) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/google/`, { token });
        if (response.data.token) {
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refresh);
            
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Google login failed' };
    }
}; 
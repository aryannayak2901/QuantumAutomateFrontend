import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, logout as authLogout } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage immediately to prevent flash of unauthenticated state
    const hasTokens = !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken');
    const storedUserJSON = localStorage.getItem('user');
    const initialUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
    
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(hasTokens);

    // Debug function to log auth state
    const logAuthState = () => {
        console.log('AuthContext State:', { 
            authenticated, 
            hasUser: !!user, 
            loading,
            accessToken: localStorage.getItem('accessToken')?.substring(0, 15) + '...' || null,
            refreshToken: localStorage.getItem('refreshToken')?.substring(0, 15) + '...' || null
        });
    };

    // This effect runs once on component mount to validate and refresh auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                logAuthState();
                
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!accessToken || !refreshToken) {
                    console.log('No tokens found, setting unauthenticated state');
                    setAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }
                
                // Set authenticated based on token presence
                console.log('Tokens found, setting authenticated state');
                setAuthenticated(true);
                
                // If we already have user data from localStorage, use it
                if (storedUserJSON) {
                    console.log('Using cached user data from localStorage');
                    setUser(JSON.parse(storedUserJSON));
                    setLoading(false);
                    
                    // Try to get fresh profile data in the background, but don't block the UI
                    fetchProfileInBackground();
                    return;
                }
                
                // Only if we don't have stored user data, try to fetch it and wait
                try {
                    console.log('Fetching profile to get initial user data...');
                    const response = await getProfile();
                    if (response && response.user) {
                        console.log('Profile fetched successfully:', response.user);
                        setUser(response.user);
                        localStorage.setItem('user', JSON.stringify(response.user));
                    } else {
                        console.warn('Profile API returned unexpected format:', response);
                    }
                } catch (error) {
                    // Just log the error - we're already authenticated based on tokens
                    console.warn('Failed to fetch initial profile data:', error);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
                logAuthState();
            }
        };
        
        // Function to fetch profile in the background without blocking UI
        const fetchProfileInBackground = async () => {
            try {
                console.log('Fetching updated profile data in background...');
                const response = await getProfile();
                if (response && response.user) {
                    console.log('Background profile update successful:', response.user);
                    setUser(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            } catch (error) {
                console.warn('Background profile update failed, keeping cached data:', error);
                // Don't change authenticated state - just keep using the cached data
            }
        };
        
        initAuth();
    }, []);

    const updateUser = (userData) => {
        console.log('Updating user data:', userData);
        setUser(userData);
        setAuthenticated(!!userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
        logAuthState();
    };

    const logout = () => {
        console.log('Logging out user');
        // Call the logout function from authService
        authLogout().catch(err => console.error('Logout error:', err));

        // Clear local storage and state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setAuthenticated(false);
        logAuthState();
    };

    const value = {
        user,
        loading,
        authenticated,
        updateUser,
        logout,
        setUser // Keep for backward compatibility with components
    };

    // Don't show loading spinner for authentication checks if we already have tokens
    // This prevents the flash of loading screen on refresh for authenticated users
    if (loading && !hasTokens) {
        return (
            <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
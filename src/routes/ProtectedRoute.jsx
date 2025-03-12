import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { user, loading, authenticated } = useAuth();
    const location = useLocation();

    // Debug log
    useEffect(() => {
        console.log('ProtectedRoute - Auth state:', { 
            authenticated, 
            hasUser: !!user, 
            loading,
            path: location.pathname
        });
    }, [authenticated, user, loading, location]);

    if (loading) {
        console.log('ProtectedRoute - Still loading, showing spinner');
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
            </div>
        );
    }

    if (!authenticated) {
        console.log('ProtectedRoute - Not authenticated, redirecting to signin');
        // Redirect to signin while saving the attempted URL
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    console.log('ProtectedRoute - Authenticated, rendering children');
    return children;
};

export default ProtectedRoute;
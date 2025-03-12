import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
    const { loading, authenticated } = useAuth();
    const location = useLocation();
    
    // Get the redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
            </div>
        );
    }

    if (authenticated) {
        // Redirect authenticated users to where they were trying to go, or dashboard
        return <Navigate to={from} replace />;
    }

    return children;
};

export default GuestRoute;
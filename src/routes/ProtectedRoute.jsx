import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('accessToken'); // Replace with your auth check
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to signin while saving the attempted URL
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
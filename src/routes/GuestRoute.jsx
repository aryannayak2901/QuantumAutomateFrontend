import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); // Replace with your auth check

    if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;
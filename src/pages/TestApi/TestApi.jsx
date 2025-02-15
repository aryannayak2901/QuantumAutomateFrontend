import React, { useEffect, useState } from "react";
import axios from "axios";

const TestApi = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/test/")
            .then(response => {
                setMessage(response.data.message);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError("Failed to fetch data");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 p-4 rounded-lg">
                    <h1 className="text-red-800 text-lg font-medium">{error}</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
            </div>
        </div>
    );
};

export default TestApi;
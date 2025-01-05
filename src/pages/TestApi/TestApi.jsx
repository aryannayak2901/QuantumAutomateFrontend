import React, { useEffect, useState } from "react";
import axios from "axios";

const TestApi = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/test/")
            .then(response => setMessage(response.data.message))
            .catch(error => console.error(error));
            console.log(message);
            
    }, []);

    return <h1>{message}</h1>;
};

export default TestApi;

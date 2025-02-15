import React, { useState } from "react";
import axios from "axios";

const ScriptTester = () => {
    const [script, setScript] = useState("");
    const [testInputs, setTestInputs] = useState([{ key: "", value: "" }]);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTestScript = async () => {
        setLoading(true);
        try {
            const variables = testInputs.reduce((acc, input) => {
                acc[input.key] = input.value;
                return acc;
            }, {});

            const result = await axios.post("http://localhost:3000/test-script", {
                script,
                variables,
            });

            setResponse(result.data.response);
        } catch (error) {
            console.error("Error testing script:", error);
        }
        setLoading(false);
    };

    const handleAddVariable = () => {
        setTestInputs([...testInputs, { key: "", value: "" }]);
    };

    const handleRemoveVariable = (index) => {
        const updatedInputs = testInputs.filter((_, i) => i !== index);
        setTestInputs(updatedInputs);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Test AI Script</h2>

                {/* Script Input */}
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter script content..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                ></textarea>

                <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">Test Variables</h3>

                {/* Dynamic Variable Inputs */}
                {testInputs.map((input, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Variable Key (e.g., name)"
                            value={input.key}
                            onChange={(e) =>
                                setTestInputs(
                                    testInputs.map((item, i) =>
                                        i === index ? { ...item, key: e.target.value } : item
                                    )
                                )
                            }
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Value (e.g., John)"
                            value={input.value}
                            onChange={(e) =>
                                setTestInputs(
                                    testInputs.map((item, i) =>
                                        i === index ? { ...item, value: e.target.value } : item
                                    )
                                )
                            }
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                            onClick={() => handleRemoveVariable(index)}
                        >
                            ✖
                        </button>
                    </div>
                ))}

                {/* Add Variable Button */}
                <button
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    onClick={handleAddVariable}
                >
                    + Add Variable
                </button>

                {/* Test Script Button */}
                <button
                    className={`w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleTestScript}
                    disabled={loading}
                >
                    {loading ? "Testing..." : "Test Script"}
                </button>

                {/* Response Output */}
                {response && (
                    <div className="mt-6 bg-gray-200 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-gray-700">Response:</h3>
                        <p className="text-gray-800">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScriptTester;

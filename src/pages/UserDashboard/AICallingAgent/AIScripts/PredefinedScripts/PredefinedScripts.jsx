import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, XCircle } from "lucide-react";

const PredefinedScripts = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedScript, setSelectedScript] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchScripts();
    }, []);

    const fetchScripts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/predefined-scripts");
            setScripts(response.data);
        } catch (error) {
            console.error("Error fetching scripts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredScripts = scripts.filter(
        (script) =>
            script.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? script.category === selectedCategory : true)
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Predefined AI Scripts</h2>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="relative w-2/3">
                        <input
                            type="text"
                            placeholder="Search scripts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute right-3 top-2 text-gray-400" />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Sales">Sales</option>
                        <option value="Support">Support</option>
                        <option value="Follow-Up">Follow-Up</option>
                    </select>

                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("");
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                    >
                        <XCircle className="inline-block mr-1" size={16} /> Reset
                    </button>
                </div>

                {/* Script Cards */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading scripts...</p>
                ) : filteredScripts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredScripts.map((script) => (
                            <div
                                key={script.id}
                                className="p-4 bg-white shadow-md rounded-md border border-gray-200 hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">{script.name}</h3>
                                <p className="text-sm text-gray-500">Category: {script.category}</p>
                                <p className="text-sm text-gray-600 mt-2">{script.description}</p>
                                <button
                                    onClick={() => {
                                        setSelectedScript(script);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    View Script
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No scripts found.</p>
                )}

                {/* Modal for Viewing Script */}
                {isModalOpen && selectedScript && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h3 className="text-xl font-bold text-gray-800">{selectedScript.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">Category: {selectedScript.category}</p>
                            <p className="text-gray-700">{selectedScript.script}</p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredefinedScripts;

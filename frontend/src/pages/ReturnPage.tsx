import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import type { Lending } from "../types/Lending";

const ReturnPage: React.FC = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [selectedLendingId, setSelectedLendingId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchLendings();
    }, []);

    const fetchLendings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<Lending[]>(
                "http://localhost:3000/api/lending"
            );
            const notReturned = response.data.filter((l) => !l.isReturned);
            setLendings(notReturned);
        } catch (err) {
            console.error("Error fetching lendings:", err);
            toast.error("Failed to fetch lendings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!selectedLendingId) {
            toast.error("Select a lending record");
            return;
        }

        try {
            await axios.put(
                `http://localhost:3000/api/lending/return/${selectedLendingId}`
            );
            toast.success("Book marked as returned");
            setSelectedLendingId("");
            fetchLendings();
        } catch (err) {
            console.error("Error returning book:", err);
            toast.error("Error returning book");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <PulseLoader color="#6366f1" size={12} margin={4} />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Return a Book
                </h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Lending
                    </label>
                    <select
                        value={selectedLendingId}
                        onChange={(e) => setSelectedLendingId(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="">-- Choose Lending --</option>
                        {lendings.map((lending) => (
                            <option key={lending._id} value={lending._id}>
                                {lending.readerId?.name} - {lending.bookId?.title} by{" "}
                                {lending.bookId?.author}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleReturn}
                    disabled={!selectedLendingId}
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition ${
                        !selectedLendingId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    Mark as Returned
                </button>
            </div>
        </div>
    );
};

export default ReturnPage;

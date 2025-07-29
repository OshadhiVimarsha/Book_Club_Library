import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardStatus: React.FC = () => {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [totalReaders, setTotalReaders] = useState<number>(0);
  const [totalLendings, setTotalLendings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [booksRes, readersRes, lendingsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/book"),
          axios.get("http://localhost:3000/api/reader"),
          axios.get("http://localhost:3000/api/lending"),
        ]);


        setTotalBooks(booksRes.data.length);
        setTotalReaders(readersRes.data.length);
        setTotalLendings(lendingsRes.data.length);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
          Loading dashboard stats...
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-gray-500 text-sm uppercase">Total Books</h2>
            <p className="text-3xl font-bold text-blue-600">{totalBooks}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-gray-500 text-sm uppercase">Total Readers</h2>
            <p className="text-3xl font-bold text-green-600">{totalReaders}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-gray-500 text-sm uppercase">Total Lendings</h2>
            <p className="text-3xl font-bold text-purple-600">{totalLendings}</p>
          </div>
        </div>
      </div>
  );
};

export default DashboardStatus;

import React, { useEffect, useState } from "react";
import Dialog from "../components/Dialog";
import LendingTable from "../components/tables/LendingTable";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";

import type { Lending } from "../types/Lending";
import type { Readers } from "../types/Readers";
import type { Book } from "../types/Book";

const LendingPage: React.FC = () => {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [readers, setReaders] = useState<Readers[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedReaderId, setSelectedReaderId] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLending, setSelectedLending] = useState<Lending | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const [lendRes, readerRes, bookRes] = await Promise.all([
        axios.get<Lending[]>("http://localhost:3000/api/lending"),
        axios.get<Readers[]>("http://localhost:3000/api/reader"),
        axios.get<Book[]>("http://localhost:3000/api/book"),
      ]);

      setLendings(lendRes.data);
      setReaders(readerRes.data);
      setBooks(bookRes.data);
    } catch (err) {
      toast.error("Error fetching lending data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimpleSubmit = () => {
    if (!selectedReaderId || !selectedBookId) {
      toast.error("Please select both reader and book");
      return;
    }

    const data = {
      readerId: selectedReaderId,
      bookId: selectedBookId,
    };

    axios
        .post("http://localhost:3000/api/lending/lend", data)
        .then(() => {
          toast.success("Book lent successfully");
          setSelectedReaderId("");
          setSelectedBookId("");
          fetchData();
        })
        .catch((error) => {
          toast.error("Error lending book");
          console.error(error.response?.data || error.message);
        });
  };

  const cancelDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedLending(null);
  };

  const confirmDelete = async () => {
    if (selectedLending) {
      try {
        await axios.delete(`http://localhost:3000/api/lending/${selectedLending._id}`);
        toast.success("Lending deleted");
        fetchData();
      } catch (err) {
        toast.error("Error deleting lending");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedLending(null);
      }
    }
  };

  const handleNotifyOverdue = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/lending/notify-overdue");
      toast.success(response.data.message);
    } catch (err) {
      toast.error("Error sending notifications");
    }
  };

  const selectedBook = books.find((b) => b._id === selectedBookId);
  const selectedReader = readers.find((r) => r._id === selectedReaderId);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <PulseLoader color="#6366f1" size={12} margin={10} />
        </div>
    );
  }

  return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Quick Lend */}
          <div className="mb-10 bg-white p-6 sm:p-10 md:p-14 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Quick Lend
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Book</option>
                {books.map((book) => (
                    <option key={book._id} value={book._id} >
                      {book.title}
                    </option>
                ))}
              </select>

              <select
                  value={selectedReaderId}
                  onChange={(e) => setSelectedReaderId(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Reader</option>
                {readers.map((reader) => (
                    <option key={reader._id} value={reader._id}>
                      {reader.name} - {reader.email}
                    </option>
                ))}
              </select>

              <button
                  onClick={handleSimpleSubmit}
                  className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 w-full"
              >
                Lend Book
              </button>
            </div>

            {selectedBook && (
                <p className="text-sm text-gray-600">
                  <strong>Selected Book:</strong> {selectedBook.title} by{" "}
                  {selectedBook.author}
                </p>
            )}

            {selectedReader && (
                <p className="text-sm text-gray-600">
                  <strong>Reader:</strong> {selectedReader.name} ({selectedReader.email})
                </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Lending Records
              </h1>
              <p className="text-gray-600 mt-1">
                Total lendings: {lendings.length}
              </p>
            </div>

            <button
                onClick={handleNotifyOverdue}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150 w-full md:w-auto"
            >
              Notify Overdue Books
            </button>
          </div>

          <LendingTable
              lendings={lendings}
              onView={(lending) => {
                setSelectedLending(lending);
              }}
              onDelete={(lending) => {
                setSelectedLending(lending);
                setIsDeleteDialogOpen(true);
              }} onEdit={function (): void {
            throw new Error("Function not implemented.");
          }}          />

          <Dialog
              isOpen={isDeleteDialogOpen}
              onCancel={cancelDialog}
              onConfirm={confirmDelete}
              title="Delete Lending"
          >
            <p className="text-gray-700">
              Are you sure you want to delete Lending #{selectedLending?._id}? This
              action cannot be undone.
            </p>
          </Dialog>
        </div>
      </div>
  );
};

export default LendingPage;

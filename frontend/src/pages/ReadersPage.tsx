import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Readers } from "../types/Readers.ts";
import ReadersTable from "../components/tables/ReadersTable.tsx";
import ReadersForm from "../components/forms/ReaderForm.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import {
  getAllReaders,
  removeReaders,
  addReaders,
  updateReaders,
} from "../services/readersService.ts";

const ReadersPage: React.FC = () => {
  const [readers, setReaders] = useState<Readers[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Readers | null>(null);

  const onGetReaders = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await getAllReaders();
      setReaders(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Error getting readers!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetReaders();
  }, []);

  const handleAddReader = () => {
    setSelectedReader(null);
    setIsAddDialogOpen(true);
  };

  const handleEditReader = (reader: Readers) => {
    setSelectedReader(reader);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReader = (reader: Readers) => {
    setSelectedReader(reader);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (readerData: Omit<Readers, "_id">) => {
    if (selectedReader) {
      try {
        const updatedReader = await updateReaders(selectedReader._id, readerData);
        setReaders((prev) =>
            prev.map((reader) =>
                reader._id === selectedReader._id ? updatedReader : reader
            )
        );
        toast.success("Reader updated successfully!");
        setIsEditDialogOpen(false);
        await onGetReaders();
      } catch (error) {
        toast.error(axios.isAxiosError(error) ? error.message : "Error updating reader!");
      }
    } else {
      try {
        const newReader = await addReaders(readerData);
        setReaders((prev) => [...prev, newReader]);
        toast.success("Reader added successfully!");
        setIsAddDialogOpen(false);
      } catch (error) {
        toast.error(axios.isAxiosError(error) ? error.message : "Error adding reader!");
      }
    }
    setSelectedReader(null);
  };

  const confirmDelete = async () => {
    if (selectedReader) {
      try {
        await removeReaders(selectedReader._id);
        await onGetReaders();
        toast.success("Reader deleted successfully!");
      } catch (error) {
        toast.error(axios.isAxiosError(error) ? error.message : "Error deleting reader!");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedReader(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedReader(null);
  };

  const filteredReaders = readers.filter((reader) =>
      reader.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Readers</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Total Readers: {filteredReaders.length}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0">
              <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
              />
              <button
                  onClick={handleAddReader}
                  className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
              >
                <MdAdd className="w-5 h-5 mr-1" />
                <span>Add Reader</span>
              </button>
            </div>
          </div>

          <ReadersTable
              readers={filteredReaders}
              onEdit={handleEditReader}
              onDelete={handleDeleteReader}
          />

          <Dialog
              isOpen={isAddDialogOpen}
              onCancel={cancelDialog}
              onConfirm={() => {
                const form = document.querySelector("form") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              title="Add New Reader"
          >
            <ReadersForm onSubmit={handleFormSubmit} />
          </Dialog>

          <Dialog
              isOpen={isEditDialogOpen}
              onCancel={cancelDialog}
              onConfirm={() => {
                const form = document.querySelector("form") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              title="Edit Reader"
          >
            <ReadersForm reader={selectedReader} onSubmit={handleFormSubmit} />
          </Dialog>

          <Dialog
              isOpen={isDeleteDialogOpen}
              onCancel={cancelDialog}
              onConfirm={confirmDelete}
              title="Delete Reader"
          >
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{selectedReader?.name}</strong>? This action
              cannot be undone.
            </p>
          </Dialog>
        </div>
      </div>
  );
};

export default ReadersPage;

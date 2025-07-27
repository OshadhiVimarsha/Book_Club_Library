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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Readers | null>(null);

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
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Error updating reader!");
        }
      }
    } else {
      try {
        const newReader = await addReaders(readerData);
        setReaders((prev) => [...prev, newReader]);
        toast.success("Reader added successfully!");
        setIsAddDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Error adding reader!");
        }
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
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Error deleting reader!");
        }
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

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <PulseLoader color="#6366f1" size={12} margin={10} />
        </div>
    );
  }

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Readers</h1>
            <button
                onClick={handleAddReader}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
            >
              <MdAdd className="w-5 h-5" />
              <span>Add Reader</span>
            </button>
          </div>

          <ReadersTable
              readers={readers}
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
              Are you sure you want to delete <strong>{selectedReader?.name}</strong>? This action cannot be undone.
            </p>
          </Dialog>
        </div>
      </div>
  );
};

export default ReadersPage;

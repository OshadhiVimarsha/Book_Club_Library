import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Book } from "../types/Book.ts";
import BooksTable from "../components/tables/BooksTable.tsx";
import BookForm from "../components/forms/BookForm.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import {
  removeBooks,
  getAllBooks,
  addBook,
  updateBook,
} from "../services/bookService.ts";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onGetBooks = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await getAllBooks();
      setBooks(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Error getting books!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetBooks();
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsAddDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (bookData: Omit<Book, "_id">) => {
    if (selectedBook) {
      try {
        const updatedBook = await updateBook(selectedBook._id, bookData);
        setBooks((prev) =>
            prev.map((book) =>
                book._id === selectedBook._id ? updatedBook : book
            )
        );
        toast.success("Book updated successfully!");
        setIsEditDialogOpen(false);
        await onGetBooks();
      } catch (error) {
        toast.error("Error updating book!");
      }
    } else {
      try {
        const newBook = await addBook(bookData);
        setBooks((prev) => [...prev, newBook]);
        toast.success("Book added successfully!");
        setIsAddDialogOpen(false);
      } catch (error) {
        toast.error("Error adding book!");
      }
    }
    setSelectedBook(null);
  };

  const confirmDelete = async () => {
    if (selectedBook) {
      try {
        await removeBooks(selectedBook._id);
        await onGetBooks();
        toast.success("Book deleted successfully!");
      } catch (error) {
        toast.error("Error deleting book!");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter(
      (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <PulseLoader color="#6366f1" size={12} margin={10} />
        </div>
    );
  }

  return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header with Total Books and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Books</h1>
              <p className="text-gray-600 mt-1">
                Total Books: {filteredBooks.length}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
              <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                  onClick={handleAddBook}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 w-full sm:w-auto"
              >
                <MdAdd className="w-5 h-5" />
                <span>Add Books</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <BooksTable
                books={filteredBooks}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
            />
          </div>

          <Dialog
              isOpen={isAddDialogOpen}
              onCancel={cancelDialog}
              onConfirm={() => {
                const form = document.querySelector("form") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              title="Add New Book"
          >
            <BookForm onSubmit={handleFormSubmit} />
          </Dialog>

          <Dialog
              isOpen={isEditDialogOpen}
              onCancel={cancelDialog}
              onConfirm={() => {
                const form = document.querySelector("form") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              title="Edit Book"
          >
            <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
          </Dialog>

          <Dialog
              isOpen={isDeleteDialogOpen}
              onCancel={cancelDialog}
              onConfirm={confirmDelete}
              title="Delete Book"
          >
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{selectedBook?.title}</strong>? This action cannot be undone.
            </p>
          </Dialog>
        </div>
      </div>
  );
};

export default BooksPage;

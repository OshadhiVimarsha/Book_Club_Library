import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Book } from '../../types/Book.ts';

interface BooksTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({ books, onEdit, onDelete }) => {
  return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Language
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No books found
                </td>
              </tr>
          ) : (
              books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {book._id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {book.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.language}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(book)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onDelete(book)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
};

export default BooksTable;

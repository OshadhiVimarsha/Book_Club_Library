import React from "react";
import type { Lending } from "../types/Lending";

interface LendingViewProps {
  lending: Lending;
}

const LendingView: React.FC<LendingViewProps> = ({ lending }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (returned: boolean) => {
    return (
        <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
                returned ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
        >
        {returned ? "Returned" : "Not Returned"}
      </span>
    );
  };

  return (
      <div className="space-y-6">
        {/* Lending Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Lending #{lending._id}</h3>
              <p className="text-gray-600 mt-1">Reader: {lending.readerId?.name}</p>
              <p className="text-gray-600">Date Lent: {formatDate(lending.borrowedDate)}</p>
            </div>
            <div>{getStatusBadge(lending.isReturned)}</div>
          </div>
        </div>

        {/* Lending Books */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Borrowed Books</h4>
          <div className="space-y-2">
            {lending.books.map((book) => (
                <div key={book.bookId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium">{book.title}</span>
                    <span className="text-gray-500 ml-2 italic">by {book.author}</span>
                  </div>
                  {book.dueDate && (
                      <div className="text-right text-sm text-gray-600">
                        Due: {formatDate(book.dueDate)}
                      </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default LendingView;

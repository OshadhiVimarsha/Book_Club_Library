import React from 'react';
import type { Lending } from "../../types/Lending.ts";
import { MdDelete, MdAssignmentReturn } from 'react-icons/md';

interface LendingTableProps {
  lendings: Lending[];
  onView: (lending: Lending) => void;
  onDelete: (lending: Lending) => void;
  onEdit: (lending: Lending) => void;
  onReturn: (lending: Lending) => void;
}

const LendingTable: React.FC<LendingTableProps> = ({
                                                     lendings,
                                                     onDelete,
                                                     onReturn,
                                                   }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const isOverdue = (lending: Lending) => {
    return !lending.isReturned && new Date(lending.dueDate) < new Date();
  };

  const getStatusBadge = (returned: boolean) => {
    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
                returned
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}
        >
        {returned ? 'Returned' : 'Not Returned'}
      </span>
    );
  };

  return (
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Lending ID
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Reader Name
            </th>
            <th className="hidden sm:table-cell px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Reader Email
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Book Title
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Borrowed Date
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-2 py-2 sm:px-6 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {lendings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No lendings found
                </td>
              </tr>
          ) : (
              lendings.map((lending) => (
                  <tr
                      key={lending._id}
                      className={isOverdue(lending) ? 'bg-red-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-2 py-2 sm:px-6 sm:py-4 font-medium text-gray-900">
                      {lending._id || 'N/A'}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-gray-900">
                      {lending.readerId?.name || 'Unknown'}
                    </td>
                    <td className="hidden sm:table-cell px-2 py-2 sm:px-6 sm:py-4 text-gray-900">
                      {lending.readerId?.email || 'N/A'}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-gray-900">
                      {lending.bookId?.title || 'N/A'}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-gray-900">
                      {formatDate(lending.borrowedDate)}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-gray-900">
                      {formatDate(lending.dueDate)}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4">
                      {getStatusBadge(lending.isReturned)}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        {!lending.isReturned && (
                            <button
                                onClick={() => onReturn(lending)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition duration-150"
                                title="Return Book"
                            >
                              <MdAssignmentReturn className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(lending)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
                            title="Delete Lending"
                        >
                          <MdDelete className="w-4 h-4" />
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

export default LendingTable;

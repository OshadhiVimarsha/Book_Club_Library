import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Readers } from '../../types/Readers.ts';

interface ReadersTableProps {
  readers: Readers[];
  onEdit: (reader: Readers) => void;
  onDelete: (reader: Readers) => void;
}

const ReadersTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
  return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {readers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No readers found</td>
              </tr>
          ) : (
              readers.map((reader) => (
                  <tr key={reader._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reader.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reader.isActive ? (
                          <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                          <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(reader.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(reader)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition duration-150"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(reader)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
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

export default ReadersTable;

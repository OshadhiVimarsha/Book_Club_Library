import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Readers } from "../../types/Readers.ts";

interface ReadersTableProps {
  readers: Readers[];
  onEdit: (reader: Readers) => void;
  onDelete: (reader: Readers) => void;
}

const ReadersTable: React.FC<ReadersTableProps> = ({
                                                     readers,
                                                     onEdit,
                                                     onDelete,
                                                   }) => {
  return (
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Address
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Joined Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {readers.length === 0 ? (
              <tr>
                <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No readers found
                </td>
              </tr>
          ) : (
              readers.map((reader) => (
                  <tr key={reader._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{reader._id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{reader.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{reader.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{reader.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {reader.address}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {reader.isActive ? (
                          <span className="text-green-600 font-medium">Active</span>
                      ) : (
                          <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(reader.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(reader)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(reader)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"
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

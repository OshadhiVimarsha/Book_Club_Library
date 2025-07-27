import React, { useState, useEffect } from "react"
import type { Readers, ReadersFormData } from "../../types/Readers.ts"

interface ReaderFormProps {
  reader?: Readers | null
  onSubmit: (readerData: ReadersFormData) => void
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  address?: string
  joinedDate?: string
}

const ReaderForm: React.FC<ReaderFormProps> = ({ reader, onSubmit }) => {
  const [formData, setFormData] = useState<ReadersFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
    joinedDate: new Date(),
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (reader) {
      setFormData({
        name: reader.name,
        email: reader.email,
        phone: reader.phone,
        address: reader.address,
        isActive: reader.isActive,
        joinedDate: new Date(reader.joinedDate),
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        isActive: true,
        joinedDate: new Date(),
      })
    }
    setErrors({})
  }, [reader])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.joinedDate) newErrors.joinedDate = "Joined date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };


  return (
      <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 space-y-6 max-w-2xl mx-auto"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Reader name"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Email"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Phone number"
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.address ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Address"
          />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
        </div>

        {/* Joined Date */}
        <div>
          <label htmlFor="joinedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Joined Date <span className="text-red-500">*</span>
          </label>
          <input
              type="date"
              id="joinedDate"
              name="joinedDate"
              value={formData.joinedDate.toISOString().split("T")[0]}
              onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    joinedDate: new Date(e.target.value),
                  }))
              }
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.joinedDate ? "border-red-400" : "border-gray-300"
              }`}
          />
          {errors.joinedDate && <p className="text-sm text-red-600 mt-1">{errors.joinedDate}</p>}
        </div>

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Submit button */}
        {/*
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition shadow-sm"
      >
        {reader ? "Update Reader" : "Add Reader"}
      </button>
      */}
      </form>
  )
}

export default ReaderForm

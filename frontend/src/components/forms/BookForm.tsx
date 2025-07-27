import React, { useState, useEffect } from "react";
import type { Book, BookFormData } from "../../types/Book.ts";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: BookFormData) => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  description?: string;
  language?: string;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    language: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        language: book.language,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        language: "",
      });
    }
    setErrors({});
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.language.trim()) newErrors.language = "Language is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

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

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>
          <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.title ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Title"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.author ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Author"
          />
          {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.description ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Brief summary of the book..."
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language <span className="text-red-500">*</span>
          </label>
          <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.language ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Language"
          />
          {errors.language && <p className="text-sm text-red-600 mt-1">{errors.language}</p>}
        </div>

        {/* Submit Button */}
        {/*<div>
          <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition shadow-sm"
          >
            {book ? "Update Book" : "Add Book"}
          </button>
        </div>*/}
      </form>
  );
};

export default BookForm;

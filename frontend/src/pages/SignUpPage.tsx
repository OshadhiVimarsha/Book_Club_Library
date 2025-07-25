import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService.ts";
import toast from "react-hot-toast";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Signup successfully");
        navigate("/login");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url('')`, // put your background image url here if needed
          }}
      >
        <div className="flex bg-white bg-opacity-50 w-full h-full items-center">
          {/* Left side - Welcome text */}
          <div className="w-1/2 text-black px-35 space-y-4">
            <h2 className="text-2xl font-bold">WELCOME</h2>
            <h1 className="text-4xl font-extrabold">BOOK CLUB LIBRARY</h1>
            <p className="text-sm">
              Your journey begins with the best books.
            </p>
          </div>

          {/* Right side - Signup form */}
          <div className="w-1/2 bg-white bg-opacity-90 p-10 rounded-xl shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Create Account
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-2 text-sm border ${
                        errors.name ? "border-red-400" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-2 text-sm border ${
                        errors.email ? "border-red-400" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-2 text-sm border ${
                        errors.password ? "border-red-400" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-2 text-sm border ${
                        errors.confirmPassword ? "border-red-400" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
              >
                {isLoading ? "Creating account..." : "CREATE"}
              </button>

              <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-indigo-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Signup;

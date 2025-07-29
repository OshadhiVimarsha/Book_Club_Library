import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/UseAuth.ts";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const user = await login(formData);
        toast.success(`Welcome, ${user.name}!`);
        authenticate(user.accessToken);
        navigate("/dashboard");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-10"
          style={{
            backgroundImage: `url('')`,
          }}
      >
        <div className="flex flex-col md:flex-row bg-opacity-90 w-full max-w-6xl mx-auto overflow-hidden">
          {/* Left Banner */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center text-black p-10 space-y-4 bg-opacity-50">
            <h2 className="text-2xl font-bold">WELCOME</h2>
            <h1 className="text-4xl font-extrabold">BOOK CLUB LIBRARY</h1>
            <p className="text-sm">Your journey begins with the best books.</p>
          </div>

          <div className="w-full md:w-1/2 bg-white bg-opacity-90 p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign In</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Username
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
                    } rounded-md`}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                    } rounded-md`}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
                <div className="flex justify-end">
                  <Link
                      to="/forgot-password"
                      className="text-xs text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </button>

              {/* Sign Up Link */}
              <p className="text-sm text-center text-gray-600">
                Not yet registered?{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;

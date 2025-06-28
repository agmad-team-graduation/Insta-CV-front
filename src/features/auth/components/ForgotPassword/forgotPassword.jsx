import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/api/v1/auth/forget-password', {
        email: email
      });

      toast.success(response.data.message || "Password reset email sent successfully", {
        bodyClassName: "mt-4 text-center text-green-600 text-sm",
      });
      setEmail('');
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="name@example.com"
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
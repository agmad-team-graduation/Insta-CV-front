import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config';

function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get all possible URL parameters
  const token = queryParams.get('token');
  const verificationToken = queryParams.get('verificationToken');
  const email = queryParams.get('email');
  const name = queryParams.get('name');

  // Determine if this is a reset or verification flow
  const isResetFlow = !!token;
  const isVerificationFlow = !!verificationToken;

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!password) {
      setError('Password is required');
      return false;
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters');
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
      let endpoint, body;

      if (isResetFlow) {
        endpoint = '/api/v1/auth/reset-password';
        body = {
          token,
          newPassword: password,
        };
      } else if (isVerificationFlow) {
        endpoint = '/api/v1/auth/register';
        body = {
          name,
          email,
          password,
          verificationToken,
        };
      } else {
        // Fallback for direct access without parameters
        toast.error("Invalid request. Please use the provided link.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send request');
      }

      const data = await response.json();
      
      // Show appropriate success message based on the flow
      if (isResetFlow) {
        toast.success("Password has been reset successfully");
      } else if (isVerificationFlow) {
        toast.success("Account created successfully");
      }

      // Clear form
      setPassword('');
      
      // Navigate to login
      navigate('/login');

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isResetFlow ? 'Reset Password' : isVerificationFlow ? 'Set Password' : 'Enter Password'}
          </h2>
          <p className="text-gray-600">
            {isResetFlow 
              ? 'Please enter your new password' 
              : isVerificationFlow 
                ? 'Please set your password to complete registration'
                : 'Please enter your password to continue'
            }
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
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
            {isSubmitting ? 'Submitting...' : (isResetFlow ? 'Reset Password' : 'Continue')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetPassword;
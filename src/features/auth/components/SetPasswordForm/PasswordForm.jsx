"use client"

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'sonner';

export function SetPasswordForm() {
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

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      }

      const response = await fetch(`http://localhost:8080${endpoint}`, {
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
    <div className="flex flex-col items-start mt-4 w-full max-w-sm">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600 mb-1">
                  Enter a password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder=""
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition self-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 
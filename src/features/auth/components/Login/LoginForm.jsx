"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { UseAuth } from "@/features/auth/context/ContextLogin";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/common/components/ui/form";
import { useState } from "react";
import { Link } from "react-router-dom";

export function LoginForm() {
  const { user, loading, handleSubmit } = UseAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log("Login form data:", data);
    await handleSubmit(data);
  };

  if (user) {
    return (
      <div className="w-full max-w-md">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Log in</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="pr-20"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-gray-600 underline">
              Forget your password
            </Link>
          </div>

          <Button
            type="submit"
            className="w-36 pt-4 pb-4 rounded-2xl py-2 text-base"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 
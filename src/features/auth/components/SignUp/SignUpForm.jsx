"use client"

import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/common/components/ui/form"
import { Input } from "@/common/components/ui/input"
import { Button } from "@/common/components/ui/button"
import { UseAuth } from '../../context/ContextSignUp';

export function SignUpForm() {
  const {
    email,
    setEmail,
    name,
    setName,
    handleSubmit,
  } = UseAuth();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = (data) => {
    console.log("Form Data:", data)
    handleSubmit();
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="" 
                      {...field} 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="" 
                      {...field} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-3 text-lg text-white hover:bg-[#4750a0]"
              style={{ background: "#505ABB" }}
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 
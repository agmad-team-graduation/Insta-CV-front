// components/SignUpForm.jsx
"use client"

import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UseAuth } from '../Context/ContextSignUp';


export function SignUpForm() {
  const {
      email,
      setEmail,
      name,
      setName,
      password,
      setPassword,
      message,
      setMessage,
      handleSubmit,
    } = UseAuth();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (data) => {
    console.log("Form Data:", data)
    handleSubmit() ;
  }

  return (
    <div className="flex  justify-center ">
      {/* Increased width of the form */}
      <div className="w-full max-w-7xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel> {/* Smaller label */}
                  <FormControl>
                    <Input placeholder="" {...field} 
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
                  <FormLabel className="text-sm">Email</FormLabel> {/* Smaller label */}
                  <FormControl>
                    <Input type="email" placeholder="" {...field} 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                    
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password</FormLabel> {/* Smaller label */}
                  <FormControl>
                    <Input type="password" placeholder="" {...field} 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                    
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Make the submit button wider */}
            <Button 
              type="submit" 
              className="w-full py-3 text-lg text-white hover:bg-[#4750a0]"
              style={{ background: "#505ABB" }}
            >
              Sign Up
            </Button>
          </form>
        </Form>
              {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}

      </div>
    </div>
  )
}

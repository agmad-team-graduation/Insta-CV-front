import React from "react";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";

export function AddJobForm({ 
  title, 
  setTitle, 
  company, 
  setCompany, 
  description, 
  setDescription, 
  onSubmit,
  isSubmitting = false,
  error = ""
}) {
  return (
    <Card className="p-6 space-y-4 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold">Add a New Job</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        required
      />
      <Input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        disabled={isSubmitting}
        required
      />
      <Textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
        required
      />

      <Button 
        onClick={onSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Job..." : "Add Job"}
      </Button>
    </Card>
  );
}

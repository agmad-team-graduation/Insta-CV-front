import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";
import { Card } from "@/common/components/ui/card";
import apiClient from "@/common/utils/apiClient";
import { toast } from 'sonner';

const AddJobDialog = ({ open, onOpenChange, onJobAdded }) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !company || !description) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const newJob = {
      title,
      company,
      description,
    };
    
    try {
      const response = await apiClient.post('/api/v1/jobs/add', newJob);
      
      // Clear form
      setTitle("");
      setCompany("");
      setDescription("");
      
      // Close dialog and notify parent
      onOpenChange(false);
      onJobAdded(response.data);
      toast.success("Job added successfully");
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job. Please try again.");
      toast.error("Failed to add job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Enter the details of the job you want to add
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4">
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
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Job..." : "Add Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog; 
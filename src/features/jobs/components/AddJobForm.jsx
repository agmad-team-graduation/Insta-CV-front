import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import { useCookies } from 'react-cookie';
  
export default function AddJobCard() {
  const navigate = useNavigate();
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
      
      // Navigate to jobs page
      navigate("/jobs");
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* <AddJobForm
        title={title}
        setTitle={setTitle}
        company={company}
        setCompany={setCompany}
        description={description}
        setDescription={setDescription}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      /> */}
    </div>
  );
}
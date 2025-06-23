import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/common/components/ui/dialog";
import { FileText, User, Briefcase, Upload, Loader2 } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';

const CreateResumeDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();
  const [uploadingCV, setUploadingCV] = useState(false);
  const [selectedCVFile, setSelectedCVFile] = useState(null);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCreateEmptyResume = async () => {
    try {
      const newResumeId = await createNewResume(true);
      onOpenChange(false);
      navigate(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Error creating new resume:', error);
      toast.error('Failed to create new resume');
    }
  };

  const handleCreateFromProfile = async () => {
    try {
      const newResumeId = await createNewResume(false);
      onOpenChange(false);
      navigate(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Error creating resume from profile:', error);
      toast.error('Failed to create resume from profile');
    }
  };

  const handleCreateForJob = () => {
    onOpenChange(false);
    navigate('/jobs'); // Navigate to jobs page to select a job
  };

  const handleCVFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    setSelectedCVFile(file);
    handleCVUpload(file);
  };

  const handleCVUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingCV(true);
      setShowUploadProgress(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);

      // Start progress simulation immediately
      const startTime = Date.now();
      const maxDuration = 20000; // 20 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / maxDuration) * 100, 95); 
        setUploadProgress(progress);
      }, 100);
      const response = await apiClient.post('/api/v1/cv/create_from_old_cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(() => {
        toast.success('CV uploaded successfully! Resume created.');
        setShowUploadProgress(false);
        onOpenChange(false);
        navigate(`/resumes/${result.cvId || result.id}`);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV. Please try again.');
      setShowUploadProgress(false);
    } finally {
      setUploadingCV(false);
      setSelectedCVFile(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Choose how you would like to create your resume
            </DialogDescription>
          </DialogHeader>
          
          {/* Hidden file input for CV upload */}
          <input
            type="file"
            id="cv-upload-resume"
            accept=".pdf"
            onChange={handleCVFileSelect}
            style={{ display: 'none' }}
            disabled={uploadingCV}
          />
          
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={handleCreateEmptyResume}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Empty Resume</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                Start with a blank resume and build it from scratch
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={handleCreateFromProfile}
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">From Profile</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                Create a resume using your profile information
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => document.getElementById('cv-upload-resume').click()}
              disabled={uploadingCV}
            >
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <span className="font-medium">Upload CV</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                Upload your existing CV to create a new resume
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={handleCreateForJob}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">For Specific Job</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                Create a resume tailored to a specific job posting
              </span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV Upload Progress Modal */}
      <Dialog open={showUploadProgress} onOpenChange={(open) => {
        if (!open) {
          setShowUploadProgress(false);
        }
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
            
            {/* Content */}
            <div className="relative p-8">
              <div className="text-center">
                {/* Animated Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Processing Your CV
                </h3>
                <p className="text-gray-600 mb-6">
                  We're analyzing your CV and creating a new resume...
                </p>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                
                {/* Status Messages */}
                <div className="mt-6 text-sm text-gray-500">
                  {uploadProgress < 30 && "Uploading CV file..."}
                  {uploadProgress >= 30 && uploadProgress < 60 && "Parsing document content..."}
                  {uploadProgress >= 60 && uploadProgress < 90 && "Creating resume structure..."}
                  {uploadProgress >= 90 && uploadProgress < 100 && "Finalizing your resume..."}
                  {uploadProgress >= 100 && "Resume created successfully!"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateResumeDialog; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/common/components/ui/dialog";
import { FileText, User, Briefcase } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import { toast } from 'sonner';

const CreateResumeDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Choose how you would like to create your resume
          </DialogDescription>
        </DialogHeader>
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
  );
};

export default CreateResumeDialog; 
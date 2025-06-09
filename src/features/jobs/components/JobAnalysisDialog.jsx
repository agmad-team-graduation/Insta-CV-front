import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const JobAnalysisDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Job Analysis in Progress</DialogTitle>
          <DialogDescription>
            Please wait while we analyze this job for you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          We're matching your skills with this job. This may take a moment...
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default JobAnalysisDialog; 
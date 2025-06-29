import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/common/components/ui/dialog";
import { Loader2, Info } from "lucide-react";

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
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            We're matching your skills with this job. This may take a moment...
          </p>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 text-left">
              <strong>First time?</strong> If this is your first job analysis, it may take a bit longer as we set up your profile and analyze your skills.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobAnalysisDialog; 
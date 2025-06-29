import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Monitor, Smartphone, ExternalLink, AlertTriangle } from "lucide-react";

const MobileWarningModal = ({ open, onOpenChange }) => {
  const handleViewAsDesktop = () => {
    // Open the current URL in a new tab with desktop user agent
    const currentUrl = window.location.href;
    window.open(currentUrl, '_blank');
  };

  const handleContinueAnyway = () => {
    // Close the modal but keep it closed
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Mobile Not Supported Yet
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            InstaCV is currently optimized for desktop use. For the best experience, we recommend viewing on a larger screen.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Why mobile isn't supported */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Why mobile isn't supported yet:
            </h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Complex resume builder interface</li>
              <li>• Detailed job analysis features</li>
              <li>• Advanced profile management tools</li>
              <li>• PDF generation and editing</li>
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Recommended alternatives:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use a desktop or laptop computer</li>
              <li>• Try tablet in landscape mode</li>
              <li>• Use browser's "Desktop site" option</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={handleViewAsDesktop}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open as Desktop Site
            </Button>
            
            <Button 
              onClick={handleContinueAnyway}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Continue Anyway (Limited)
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center">
            Note: Some features may not work properly on mobile devices.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarningModal; 
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import ResumePreview from '../components/ResumePreview';

const ResumePreviewPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const {
    resume,
    isLoading,
    error,
    fetchResume,
    setSelectedTemplate
  } = useResumeStore();

  useEffect(() => {
    if (id) {
      fetchResume(parseInt(id));
    }
  }, [id, fetchResume]);

  // Set template from URL parameter
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      setSelectedTemplate(templateParam);
    }
  }, [searchParams, setSelectedTemplate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading your resume...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md">
          <h2 className="font-bold text-lg mb-2">Error Loading Resume</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-w-md">
          <h2 className="font-bold text-lg mb-2">Resume Not Found</h2>
          <p>The requested resume could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print-only styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0;  
            size: A4;
          }
          
          /* Allow multiple pages for resume */
          .resume-container {
            max-height: none !important;
            overflow: visible !important;
            height: auto !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          
          /* Prevent page breaks within sections */
          .resume-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Optimize spacing for multi-page layout */
          .resume-header {
            padding: 0.5rem 1rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .resume-content {
            padding: 0.5rem 1rem !important;
          }
          
          /* Reduce margins and padding for compact layout */
          .compact-spacing {
            margin-bottom: 0.5rem !important;
            padding: 0.25rem 0 !important;
          }
          
          /* Ensure text doesn't overflow */
          .text-overflow-ellipsis {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
          
          /* Allow multi-page layout */
          .single-page-resume {
            max-height: none !important;
            overflow: visible !important;
            height: auto !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          
          /* Remove shadows, borders, and rounded corners for clean printing */
          .shadow-lg,
          .shadow-md,
          .shadow-sm,
          .shadow,
          .shadow-xl,
          .shadow-2xl {
            box-shadow: none !important;
          }
          
          .rounded-lg,
          .rounded-md,
          .rounded-sm,
          .rounded,
          .rounded-xl,
          .rounded-2xl,
          .rounded-3xl,
          .rounded-full {
            border-radius: 0 !important;
          }
          
          .border,
          .border-2,
          .border-t,
          .border-b,
          .border-l,
          .border-r {
            border: none !important;
          }
          
          /* Remove any overflow hidden that might cause issues */
          .overflow-hidden {
            overflow: visible !important;
          }
        }
        
        /* Screen styles for preview */
        @media screen {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          /* Show scrollbar for screen preview */
          .resume-container {
            max-height: 100vh;
            overflow-y: auto;
          }
          
          /* Add a subtle border to show A4 boundaries */
          .single-page-resume {
            border: 1px solid #e5e7eb;
            max-width: 21cm;
            margin: 0 auto;
            min-height: 29.7cm;
            background: white;
          }
        }
      `}</style>
      
      {/* Resume content only - no UI elements */}
      <div className="w-full h-full print:p-0 resume-container single-page-resume">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};

export default ResumePreviewPage; 
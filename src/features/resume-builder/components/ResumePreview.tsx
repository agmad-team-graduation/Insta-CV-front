import React, { useEffect, useRef } from 'react';
import { Resume } from '../types';
import useResumeStore from '../store/resumeStore';
import { generatePdf, generateFilename } from '../services/pdfGenerator';
import { getTemplate } from './templates';
import { toast } from 'sonner';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { selectedTemplate } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);

  // Listen for PDF generation event
  useEffect(() => {
    const handleGeneratePdf = async () => {
      let loadingToast: string | number | undefined;
      let timeoutId: NodeJS.Timeout | undefined;
      
      try {
        // Show loading toast
        loadingToast = toast.loading('Generating PDF...', {
          duration: Infinity,
        });
        
        // Set a timeout to ensure we don't get stuck in loading state
        timeoutId = setTimeout(() => {
          if (loadingToast) {
            toast.dismiss(loadingToast);
          }
          toast.error('PDF generation timed out. Please try again.');
          
          // Notify parent component that PDF generation failed
          const completeEvent = new CustomEvent('pdf-generation-complete', { 
            detail: { 
              success: false,
              error: 'PDF generation timed out'
            }
          });
          document.dispatchEvent(completeEvent);
        }, 25000); // 25 second timeout
        
        const filename = generateFilename(resume, selectedTemplate);
        
        // Pass resume data directly to the new PDF generator
        await generatePdf(resume, { filename });
        
        // Clear timeout since generation succeeded
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Dismiss loading toast and show success
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }
        toast.success('PDF generated successfully!');
        
        // Notify parent component that PDF generation is complete
        const completeEvent = new CustomEvent('pdf-generation-complete', { 
          detail: { success: true }
        });
        document.dispatchEvent(completeEvent);
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Clear timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Dismiss loading toast and show error
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }
        toast.error(
          error instanceof Error 
            ? error.message 
            : 'Failed to generate PDF. Please try again.'
        );
        
        // Notify parent component that PDF generation failed
        const completeEvent = new CustomEvent('pdf-generation-complete', { 
          detail: { 
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        document.dispatchEvent(completeEvent);
      }
    };

    const previewElement = document.getElementById('resume-preview-container');
    if (previewElement) {
      previewElement.addEventListener('generate-pdf', handleGeneratePdf);
    }

    return () => {
      if (previewElement) {
        previewElement.removeEventListener('generate-pdf', handleGeneratePdf);
      }
    };
  }, [resume, selectedTemplate]);

  // Get the selected template component and render it (restored original approach)
  const TemplateComponent = getTemplate(selectedTemplate);
  
  return (
    <div id="resume-preview-container" ref={previewRef}>
      <TemplateComponent resume={resume} />
    </div>
  );
};

export default ResumePreview; 
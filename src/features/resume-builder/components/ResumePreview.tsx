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
      if (previewRef.current) {
        try {
          // Show loading toast
          const loadingToast = toast.loading('Generating PDF...', {
            duration: Infinity,
          });
          
          const filename = generateFilename(resume, selectedTemplate);
          await generatePdf(previewRef.current, { filename });
          
          // Dismiss loading toast and show success
          toast.dismiss(loadingToast);
          toast.success('PDF generated successfully!');
          
          // Notify parent component that PDF generation is complete
          const completeEvent = new CustomEvent('pdf-generation-complete', { 
            detail: { success: true }
          });
          document.dispatchEvent(completeEvent);
          
        } catch (error) {
          console.error('Error generating PDF:', error);
          
          // Show error toast
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

  // Get the selected template component and render it
  const TemplateComponent = getTemplate(selectedTemplate);
  
  return (
    <div id="resume-preview-container" ref={previewRef}>
      <TemplateComponent resume={resume} />
    </div>
  );
};

export default ResumePreview; 
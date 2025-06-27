import React, { useEffect, useRef } from 'react';
import { Resume } from '../types';
import useResumeStore from '../store/resumeStore';
// import { generatePdf, generateFilename } from '../services/pdfGenerator';
import { getTemplateComponent } from './templates';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { selectedTemplate } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);

  // Listen for PDF generation event
  // useEffect(() => {
  //   const handleGeneratePdf = async () => {
  //     if (previewRef.current) {
  //       try {
  //         const filename = generateFilename(resume, selectedTemplate);
  //         await generatePdf(previewRef.current, { filename });
  //       } catch (error) {
  //         console.error('Error generating PDF:', error);
  //       }
  //     }
  //   };

  //   const previewElement = document.getElementById('resume-preview-container');
  //   if (previewElement) {
  //     previewElement.addEventListener('generate-pdf', handleGeneratePdf);
  //   }

  //   return () => {
  //     if (previewElement) {
  //       previewElement.removeEventListener('generate-pdf', handleGeneratePdf);
  //     }
  //   };
  // }, [resume, selectedTemplate]);

  // Get the selected template component and render it
  const TemplateComponent = getTemplateComponent(selectedTemplate);
  
  return (
    <div id="resume-preview-container" ref={previewRef}>
      <TemplateComponent resume={resume} />
    </div>
  );
};

export default ResumePreview; 
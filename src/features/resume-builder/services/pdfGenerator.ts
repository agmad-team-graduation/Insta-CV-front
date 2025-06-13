import html2pdf from 'html2pdf.js';
import { Resume, TemplateName } from '../types';

interface GeneratePdfOptions {
  filename?: string;
  margin?: number;
  pageSize?: string;
}

/**
 * Generate a PDF from the resume preview element
 */
export const generatePdf = async (
  resumeElement: HTMLElement,
  options: GeneratePdfOptions = {}
) => {
  if (!resumeElement) {
    throw new Error('Resume element not found');
  }

  const defaultOptions = {
    filename: 'resume.pdf',
    margin: 10,
  };

  const pdfOptions = {
    ...defaultOptions,
    ...options,
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm',
    },
  };

  try {
    // Make a clone to avoid modifying the displayed element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    
    // Apply print-specific styles
    clonedElement.classList.add('print-mode');
    
    // Create temporary container
    const container = document.createElement('div');
    container.appendChild(clonedElement);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Generate PDF
    const pdf = await html2pdf()
      .set(pdfOptions as any)
      .from(clonedElement)
      .save();
    
    // Clean up
    document.body.removeChild(container);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate filename for the resume
 */
export const generateFilename = (resume: Resume, template: TemplateName): string => {
  const name = resume.personalDetails.fullName.replace(/\s+/g, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${name}_resume_${template}_${date}.pdf`;
};

export default { generatePdf, generateFilename }; 
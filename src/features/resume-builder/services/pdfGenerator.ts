import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
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

  const { filename } = { ...defaultOptions, ...options };

  try {
    // Make a clone to avoid modifying the displayed element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    
    // Apply print-specific styles
    clonedElement.classList.add('print-mode');
    
    // Remove border radius for PDF export
    const style = document.createElement('style');
    style.textContent = `
      .print-mode {
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .print-mode * {
        border-radius: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Create temporary container
    const container = document.createElement('div');
    container.appendChild(clonedElement);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Generate canvas using html2canvas-pro
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF using jsPDF
    const pdf = new jsPDF({
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0,
      0,
      imgWidth,
      imgHeight
    );
    
    // Save the PDF
    pdf.save(filename);
    
    // Clean up
    document.body.removeChild(container);
    document.head.removeChild(style);
    
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
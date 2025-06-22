import html2pdf from 'html2pdf.js';
import { Resume, TemplateName } from '../types';

interface GeneratePdfOptions {
  filename?: string;
  margin?: number;
  pageSize?: string;
}

/**
 * Generate a PDF from the resume preview element with timeout protection
 */
export const generatePdf = async (
  resumeElement: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<void> => {
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
      scale: 1.5, // Reduced scale to improve performance
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      format: 'a4' as const,
      orientation: 'portrait' as const,
      unit: 'mm' as const,
    },
  };

  // Create a promise that rejects after 30 seconds
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('PDF generation timed out')), 30000);
  });

  try {
    // Make a clone to avoid modifying the displayed element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    
    // Apply print-specific styles
    clonedElement.classList.add('print-mode');
    
    // Remove any interactive elements that might cause issues
    const interactiveElements = clonedElement.querySelectorAll('button, input, select, textarea');
    interactiveElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });
    
    // Create temporary container
    const container = document.createElement('div');
    container.appendChild(clonedElement);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.height = '297mm'; // A4 height
    document.body.appendChild(container);
    
    // Generate PDF with timeout protection
    const pdfPromise = html2pdf()
      .set(pdfOptions)
      .from(clonedElement)
      .save();
    
    await Promise.race([pdfPromise, timeoutPromise]);
    
    // Clean up
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // If html2pdf fails, try the fallback method
    try {
      console.log('Trying fallback PDF generation method...');
      await generatePdfFallback(resumeElement, options);
    } catch (fallbackError) {
      console.error('Fallback PDF generation also failed:', fallbackError);
      throw new Error('PDF generation failed. Please try again or contact support.');
    }
  }
};

/**
 * Fallback PDF generation method using the working JavaScript version
 */
const generatePdfFallback = async (
  resumeElement: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<void> => {
  // Dynamically import the working JavaScript version
  const { generatePdf: generatePdfJS } = await import('../../../common/services/pdfGenerator.js');
  
  // Convert the element to a format the JS version expects
  const element = resumeElement as any;
  
  await generatePdfJS(element, options);
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
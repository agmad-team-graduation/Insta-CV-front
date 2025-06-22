import html2pdf from 'html2pdf.js';

/**
 * Generate a PDF from the resume preview element
 */
export const generatePdf = async (
  resumeElement,
  options = {}
) => {
  if (!resumeElement) {
    throw new Error('Resume element not found');
  }

  const defaultOptions = {
    filename: 'resume.pdf',
    margin: 10,
  };

  const pdfOptions = {
    margin: [10, 10, 10, 10],
    filename: options.filename || defaultOptions.filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  };

  try {
    // Create a clean copy for PDF generation
    const clonedElement = resumeElement.cloneNode(true);
    
    // Apply PDF-specific styles to improve text rendering
    clonedElement.style.fontFamily = 'Arial, sans-serif';
    clonedElement.style.fontSize = '14px';
    clonedElement.style.lineHeight = '1.4';
    clonedElement.style.color = '#000000';
    clonedElement.style.backgroundColor = '#ffffff';
    
    // Ensure all text elements have proper contrast
    const textElements = clonedElement.querySelectorAll('*');
    textElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.color === 'rgb(107, 114, 128)' || computedStyle.color.includes('gray')) {
        el.style.color = '#333333';
      }
    });

    // Create temporary container
    const container = document.createElement('div');
    container.appendChild(clonedElement);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = '#ffffff';
    document.body.appendChild(container);
    
    // Generate PDF with better text preservation
    const pdf = await html2pdf()
      .set(pdfOptions)
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
export const generateFilename = (resume, template) => {
  const name = resume.personalDetails.fullName.replace(/\s+/g, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${name}_resume_${template}_${date}.pdf`;
};

export default { generatePdf, generateFilename };
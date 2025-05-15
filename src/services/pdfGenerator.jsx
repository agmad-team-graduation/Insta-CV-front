// First, install the pro version:
//   npm install html2canvas-pro jspdf

import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Generate a PDF from the resume preview element
 */
export const generatePdf = async (resumeElement, options = {}) => {
  if (!resumeElement) {
    throw new Error('Resume element not found');
  }

  // merge defaults
  const {
    filename     = 'resume.pdf',
    margin       = 10,
    format       = 'a4',
    orientation  = 'portrait',
    unit         = 'mm',
    scale        = 2,
    background   = null,  // or a hex like '#fff'
    logging      = false,
    useCORS      = true,
  } = options;

  try {
    // 1) Render the element to a high-DPI canvas
    const canvas = await html2canvas(resumeElement, {
      scale,
      useCORS,
      logging,
      backgroundColor: background,
    });

    // 2) Turn that canvas into a PNG
    const imgData = canvas.toDataURL('image/png');

    // 3) Set up jsPDF
    const pdf = new jsPDF({ unit, format, orientation });

    // 4) Calculate dimensions to fit A4 (minus margins)
    const pageW  = pdf.internal.pageSize.getWidth()  - margin * 2;
    const pageH  = pdf.internal.pageSize.getHeight() - margin * 2;
    const imgW   = canvas.width;
    const imgH   = canvas.height;
    const ratio  = Math.min(pageW / imgW, pageH / imgH);

    // 5) Draw the image centered in the page
    pdf.addImage(
      imgData,
      'PNG',
      margin,
      margin,
      imgW * ratio,
      imgH * ratio,
    );

    // 6) Save!
    pdf.save(filename);
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
};

/**
 * Generate filename for the resume
 */
export const generateFilename = (resume, template) => {
  const name = resume.personalDetails.fullName
    .replace(/\s+/g, '_')
    .toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${name}_resume_${template}_${date}.pdf`;
};

export default { generatePdf, generateFilename };

import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Resume, TemplateName } from '../types';

interface GeneratePdfOptions {
  filename?: string;
  margin?: number;
  pageSize?: string;
}

// Register fonts (optional - you can add custom fonts here)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
// });

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937',
  },
  contact: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 3,
  },
  item: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 10,
    marginBottom: 3,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    backgroundColor: '#f3f4f6',
    padding: '3 8',
    borderRadius: 3,
    fontSize: 9,
    marginRight: 5,
    marginBottom: 5,
  },
});

/**
 * Generate a PDF from resume data using @react-pdf/renderer
 */
export const generatePdf = async (
  resume: Resume,
  options: GeneratePdfOptions = {}
): Promise<void> => {
  try {
    console.log('Starting PDF generation with @react-pdf/renderer...');
    
    const filename = options.filename || 'resume.pdf';

    // Create the PDF document using a simpler approach
    const MyDocument = () => (
      React.createElement(Document, {},
        React.createElement(Page, { size: 'A4', style: styles.page },
          // Header with personal details
          React.createElement(View, { style: styles.header },
            React.createElement(Text, { style: styles.name }, resume.personalDetails.fullName),
            React.createElement(Text, { style: styles.contact }, resume.personalDetails.email),
            React.createElement(Text, { style: styles.contact }, resume.personalDetails.phone),
            React.createElement(Text, { style: styles.contact }, resume.personalDetails.address)
          ),

          // Summary Section
          !resume.summarySection.hidden && resume.summarySection.summary && 
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, resume.summarySection.sectionTitle || 'Summary'),
            React.createElement(Text, { style: styles.itemDescription }, resume.summarySection.summary)
          ),

          // Experience Section
          !resume.experienceSection.hidden && resume.experienceSection.items.length > 0 &&
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, resume.experienceSection.sectionTitle || 'Experience'),
            ...resume.experienceSection.items.map((item: any, index: number) =>
              React.createElement(View, { key: index, style: styles.item },
                React.createElement(Text, { style: styles.itemTitle }, item.jobTitle),
                React.createElement(Text, { style: styles.itemSubtitle }, 
                  `${item.company} | ${item.startDate} - ${item.present ? 'Present' : item.endDate}`
                ),
                item.description && React.createElement(Text, { style: styles.itemDescription }, item.description)
              )
            )
          ),

          // Education Section
          !resume.educationSection.hidden && resume.educationSection.items.length > 0 &&
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, resume.educationSection.sectionTitle || 'Education'),
            ...resume.educationSection.items.map((item: any, index: number) =>
              React.createElement(View, { key: index, style: styles.item },
                React.createElement(Text, { style: styles.itemTitle }, item.degree),
                React.createElement(Text, { style: styles.itemSubtitle }, 
                  `${item.school} | ${item.startDate} - ${item.present ? 'Present' : item.endDate}`
                ),
                item.description && React.createElement(Text, { style: styles.itemDescription }, item.description)
              )
            )
          ),

          // Projects Section
          !resume.projectSection.hidden && resume.projectSection.items.length > 0 &&
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, resume.projectSection.sectionTitle || 'Projects'),
            ...resume.projectSection.items.map((item: any, index: number) =>
              React.createElement(View, { key: index, style: styles.item },
                React.createElement(Text, { style: styles.itemTitle }, item.title),
                React.createElement(Text, { style: styles.itemSubtitle }, 
                  `${item.startDate} - ${item.present ? 'Present' : item.endDate}`
                ),
                item.description && React.createElement(Text, { style: styles.itemDescription }, item.description)
              )
            )
          ),

          // Skills Section
          !resume.skillSection.hidden && resume.skillSection.items.length > 0 &&
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, resume.skillSection.sectionTitle || 'Skills'),
            React.createElement(View, { style: styles.skillsContainer },
              ...resume.skillSection.items.map((item: any, index: number) =>
                React.createElement(Text, { key: index, style: styles.skill }, item.skill)
              )
            )
          )
        )
      )
    );
    
    // Generate PDF blob
    const blob = await pdf(React.createElement(MyDocument)).toBlob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate filename for the resume
 */
export const generateFilename = (resume: Resume, template: TemplateName): string => {
  const name = resume.personalDetails?.fullName?.replace(/\s+/g, '_').toLowerCase() || 'resume';
  const date = new Date().toISOString().split('T')[0];
  return `${name}_resume_${template}_${date}.pdf`;
};

export default { generatePdf, generateFilename }; 
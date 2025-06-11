import React, { useEffect, useRef } from 'react';
import { formatDateRange, getSkillLevelBars, getSkillLevelClass } from '../../utils/formatters';
import useResumeStore from '../../store/resumeStore';
import { generatePdf, generateFilename } from '../../services/pdfGenerator';
import { MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, BriefcaseIcon, BookOpenIcon, CodeIcon, WrenchIcon } from 'lucide-react';

const ResumePreview = ({ resume }) => {
  const { selectedTemplate } = useResumeStore();
  const previewRef = useRef(null);

  // Sort sections by their orderIndex
  const sortedSections = Object.entries({
    education: resume.educationSection,
    experience: resume.experienceSection,
    project: resume.projectSection,
    skill: resume.skillSection
  }).sort((a, b) => {
    const orderA = resume.sectionsOrder[a[0]] || a[1].orderIndex;
    const orderB = resume.sectionsOrder[b[0]] || b[1].orderIndex;
    return orderA - orderB;
  });

  // Listen for PDF generation event
  useEffect(() => {
    const handleGeneratePdf = async () => {
      if (previewRef.current) {
        try {
          const filename = generateFilename(resume, selectedTemplate);
          await generatePdf(previewRef.current, { filename });
        } catch (error) {
          console.error('Error generating PDF:', error);
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

  const renderModernTemplate = () => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 bg-blue-700 text-white">
          <h1 className="text-3xl font-bold">{resume.personalDetails.fullName}</h1>
          <p className="text-xl text-blue-100 mt-1">{resume.personalDetails.address}</p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <MailIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.phone}</span>
            </div>
          </div>
        </div>
        
        {/* Summary */}
        {resume.summary && (
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-bold mb-3 text-gray-700">Summary</h2>
            <p className="text-gray-700">{resume.summary}</p>
          </div>
        )}
        
        {/* Main content */}
        <div className="p-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden) return null;
            
            // Sort items by orderIndex
            const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
            
            let icon;
            switch (key) {
              case 'education':
                icon = <BookOpenIcon size={20} className="text-blue-600" />;
                break;
              case 'experience':
                icon = <BriefcaseIcon size={20} className="text-blue-600" />;
                break;
              case 'project':
                icon = <CodeIcon size={20} className="text-blue-600" />;
                break;
              case 'skill':
                icon = <WrenchIcon size={20} className="text-blue-600" />;
                break;
              default:
                icon = null;
            }
            
            return (
              <div key={key} className="mb-8">
                <div className="flex items-center mb-4">
                  {icon}
                  <h2 className="text-xl font-bold ml-2 text-gray-800">{section.sectionTitle}</h2>
                </div>
                
                <div className="space-y-4">
                  {key === 'education' && sortedItems.map((education) => (
                    <div key={education.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{education.degree}</h3>
                        <span className="text-sm text-gray-600">
                          {formatDateRange(education.startDate, education.endDate, education.present)}
                        </span>
                      </div>
                      <p className="text-gray-700">{education.school}, {education.city}, {education.country}</p>
                      {education.description && (
                        <p className="text-gray-600 mt-2">{education.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'experience' && sortedItems.map((experience) => (
                    <div key={experience.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700">{experience.company}, {experience.city}, {experience.country}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2">{experience.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'project' && sortedItems.map((project) => (
                    <div key={project.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <span className="text-sm text-gray-600">
                          {formatDateRange(project.startDate, project.endDate, project.present)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mt-2">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {key === 'skill' && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {sortedItems.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-800">{skill.skill}</span>
                          <span className="text-blue-600">{getSkillLevelBars(skill.level)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClassicTemplate = () => {
    // Classic template implementation
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 bg-gray-800 text-white text-center">
          <h1 className="text-3xl font-bold">{resume.personalDetails.fullName}</h1>
          
          <div className="mt-4 flex justify-center flex-wrap gap-6">
            <div className="flex items-center">
              <MailIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.address}</span>
            </div>
          </div>
        </div>
        
        {/* Rest of the classic template implementation */}
      </div>
    );
  };

  // Additional template rendering functions would be here
  const renderTechnicalTemplate = () => {
    // Technical template implementation
    return <div>Technical Template</div>;
  };

  const renderMinimalTemplate = () => {
    // Minimal template implementation
    return <div>Minimal Template</div>;
  };

  // Render the selected template
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'classic':
        return renderClassicTemplate();
      case 'technical':
        return renderTechnicalTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div id="resume-preview-container" className="resume-preview">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
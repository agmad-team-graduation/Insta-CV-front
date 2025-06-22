import React, { useEffect, useRef } from 'react';
import { formatDateRange, getSkillLevelBars } from '../../utils/formatters';
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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto print:shadow-none print:rounded-none" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 bg-blue-700 text-white print:bg-blue-700 print:text-white">
          <h1 className="text-3xl font-bold print:text-black print:text-2xl">{resume.personalDetails.fullName}</h1>
          <p className="text-xl text-blue-100 mt-1 print:text-gray-600 print:text-base">{resume.personalDetails.address}</p>
          
          <div className="mt-4 flex flex-wrap gap-4 print:text-black">
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
          <div className="p-6 bg-gray-50 border-b print:bg-white">
            <h2 className="text-xl font-bold mb-3 text-gray-700 print:text-black">Summary</h2>
            <p className="text-gray-700 print:text-black">{resume.summary}</p>
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
                icon = <BookOpenIcon size={20} className="text-blue-600 print:text-black" />;
                break;
              case 'experience':
                icon = <BriefcaseIcon size={20} className="text-blue-600 print:text-black" />;
                break;
              case 'project':
                icon = <CodeIcon size={20} className="text-blue-600 print:text-black" />;
                break;
              case 'skill':
                icon = <WrenchIcon size={20} className="text-blue-600 print:text-black" />;
                break;
              default:
                icon = null;
            }
            
            return (
              <div key={key} className="mb-8 print:mb-6">
                <div className="flex items-center mb-4">
                  {icon}
                  <h2 className="text-xl font-bold ml-2 text-gray-800 print:text-black">{section.sectionTitle}</h2>
                </div>
                
                <div className="space-y-4 print:space-y-3">
                  {key === 'education' && sortedItems.map((education) => (
                    <div key={education.id} className="border-l-4 border-blue-600 pl-4 py-2 print:border-l-2 print:border-black">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{education.degree}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(education.startDate, education.endDate, education.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{education.school}, {education.city}, {education.country}</p>
                      {education.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{education.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'experience' && sortedItems.map((experience) => (
                    <div key={experience.id} className="border-l-4 border-blue-600 pl-4 py-2 print:border-l-2 print:border-black">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{experience.company}, {experience.city}, {experience.country}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{experience.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'project' && sortedItems.map((project) => (
                    <div key={project.id} className="border-l-4 border-blue-600 pl-4 py-2 print:border-l-2 print:border-black">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{project.title}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(project.startDate, project.endDate, project.present)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full print:bg-gray-200 print:text-black print:border print:border-gray-400">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {key === 'skill' && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 print:gap-y-2">
                      {sortedItems.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-800 print:text-black">{skill.skill}</span>
                          <span className="text-blue-600 print:text-black">{getSkillLevelBars(skill.level)}</span>
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
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto print:shadow-none print:rounded-none" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 bg-gray-800 text-white text-center print:bg-white print:text-black print:border-b print:border-gray-300">
          <h1 className="text-3xl font-bold print:text-2xl print:text-black">{resume.personalDetails.fullName}</h1>
          
          <div className="mt-4 flex justify-center flex-wrap gap-6 print:text-black">
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
        
        {/* Summary */}
        {resume.summary && (
          <div className="p-6 bg-gray-100 border-b print:bg-white">
            <p className="text-gray-700 text-center italic print:text-black">{resume.summary}</p>
          </div>
        )}
        
        {/* Main content */}
        <div className="p-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden) return null;
            
            // Sort items by orderIndex
            const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
            
            return (
              <div key={key} className="mb-8 print:mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2 print:text-black print:text-lg">{section.sectionTitle}</h2>
                
                <div className="space-y-6 print:space-y-4">
                  {key === 'education' && sortedItems.map((education) => (
                    <div key={education.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{education.degree}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(education.startDate, education.endDate, education.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{education.school}, {education.city}, {education.country}</p>
                      {education.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{education.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'experience' && sortedItems.map((experience) => (
                    <div key={experience.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{experience.company}, {experience.city}, {experience.country}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{experience.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'project' && sortedItems.map((project) => (
                    <div key={project.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base print:text-black">{project.title}</h3>
                        <span className="text-sm text-gray-600 print:text-black">
                          {formatDateRange(project.startDate, project.endDate, project.present)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mt-2 print:text-black">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded print:border print:border-gray-400 print:text-black">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {key === 'skill' && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 print:gap-y-2">
                      {sortedItems.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-800 print:text-black">{skill.skill}</span>
                          <span className="text-gray-600 print:text-black">{getSkillLevelBars(skill.level)}</span>
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

  const renderMinimalTemplate = () => {
    return (
      <div className="bg-white shadow-lg overflow-hidden max-w-4xl mx-auto print:shadow-none" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 border-b print:border-b print:border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 print:text-2xl print:text-black">{resume.personalDetails.fullName}</h1>
          
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600 print:text-black">
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
          
          {/* Summary */}
          {resume.summary && (
            <div className="mt-4 pt-4 border-t border-gray-200 print:border-gray-300">
              <p className="text-gray-700 print:text-black">{resume.summary}</p>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden) return null;
            
            // Sort items by orderIndex
            const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
            
            return (
              <div key={key} className="mb-6 print:mb-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 uppercase tracking-wider print:text-black print:text-base">{section.sectionTitle}</h2>
                
                <div className="space-y-4 print:space-y-3">
                  {key === 'education' && sortedItems.map((education) => (
                    <div key={education.id} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium print:text-black">{education.degree}</h3>
                        <span className="text-sm text-gray-500 print:text-black">
                          {formatDateRange(education.startDate, education.endDate, education.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{education.school}, {education.city}, {education.country}</p>
                      {education.description && (
                        <p className="text-gray-600 mt-1 text-sm print:text-black">{education.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'experience' && sortedItems.map((experience) => (
                    <div key={experience.id} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium print:text-black">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-500 print:text-black">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-black">{experience.company}, {experience.city}, {experience.country}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-1 text-sm print:text-black">{experience.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'project' && sortedItems.map((project) => (
                    <div key={project.id} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium print:text-black">{project.title}</h3>
                        <span className="text-sm text-gray-500 print:text-black">
                          {formatDateRange(project.startDate, project.endDate, project.present)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mt-1 text-sm print:text-black">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {project.skills.map((skill) => (
                            <span key={skill.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded print:border print:border-gray-400 print:text-black print:bg-white">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {key === 'skill' && (
                    <div className="flex flex-wrap gap-2">
                      {sortedItems.map((skill) => (
                        <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm print:border print:border-gray-400 print:text-black print:bg-white">
                          {skill.skill}
                        </span>
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

  const renderTechnicalTemplate = () => {
    return (
      <div className="bg-white shadow-lg overflow-hidden max-w-4xl mx-auto print:shadow-none" ref={previewRef}>
        <div className="flex flex-col md:flex-row print:flex-row">
          {/* Sidebar */}
          <div className="bg-gray-800 text-white p-6 md:w-1/3 print:w-1/3 print:bg-gray-200 print:text-black">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold print:text-xl print:text-black">{resume.personalDetails.fullName}</h1>
              <p className="text-gray-300 mt-1 print:text-black">{resume.personalDetails.address}</p>
              
              <div className="mt-4 space-y-2 text-sm print:text-black">
                <div className="flex items-center">
                  <MailIcon size={14} className="mr-2" />
                  <span>{resume.personalDetails.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon size={14} className="mr-2" />
                  <span>{resume.personalDetails.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            {!resume.skillSection.hidden && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-1 print:border-gray-400 print:text-black">{resume.skillSection.sectionTitle}</h2>
                <div className="space-y-2">
                  {resume.skillSection.items
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="print:text-black">{skill.skill}</span>
                          <span className="text-xs print:text-black">{skill.level.toLowerCase()}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1.5 print:bg-gray-400">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full print:bg-black" 
                            style={{ 
                              width: skill.level === 'BEGINNER' ? '25%' : 
                                     skill.level === 'INTERMEDIATE' ? '50%' : 
                                     skill.level === 'PROFICIENT' ? '75%' : '100%' 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Summary */}
            {resume.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-1 print:border-gray-400 print:text-black">Summary</h2>
                <p className="text-gray-300 text-sm print:text-black">{resume.summary}</p>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="p-6 md:w-2/3 print:w-2/3">
            {sortedSections.map(([key, section]) => {
              if (section.hidden || key === 'skill') return null;
              
              // Sort items by orderIndex
              const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
              
              return (
                <div key={key} className="mb-8 print:mb-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 print:text-black print:border-black print:text-lg">
                    {section.sectionTitle}
                  </h2>
                  
                  <div className="space-y-5 print:space-y-3">
                    {key === 'education' && sortedItems.map((education) => (
                      <div key={education.id} className="relative pl-6 pb-4 before:absolute before:left-0 before:top-1 before:bottom-0 before:w-px before:bg-blue-200 print:before:bg-gray-400">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-500 print:bg-black"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold print:text-base print:text-black">{education.degree}</h3>
                            <p className="text-gray-700 print:text-black">{education.school}, {education.city}, {education.country}</p>
                          </div>
                          <span className="text-sm text-gray-500 flex items-center print:text-black">
                            <CalendarIcon size={14} className="mr-1" />
                            {formatDateRange(education.startDate, education.endDate, education.present)}
                          </span>
                        </div>
                        {education.description && (
                          <p className="text-gray-600 mt-2 text-sm print:text-black">{education.description}</p>
                        )}
                      </div>
                    ))}
                    
                    {key === 'experience' && sortedItems.map((experience) => (
                      <div key={experience.id} className="relative pl-6 pb-4 before:absolute before:left-0 before:top-1 before:bottom-0 before:w-px before:bg-blue-200 print:before:bg-gray-400">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-500 print:bg-black"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold print:text-base print:text-black">{experience.jobTitle}</h3>
                            <p className="text-gray-700 print:text-black">{experience.company}, {experience.city}, {experience.country}</p>
                          </div>
                          <span className="text-sm text-gray-500 flex items-center print:text-black">
                            <CalendarIcon size={14} className="mr-1" />
                            {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                          </span>
                        </div>
                        {experience.description && (
                          <p className="text-gray-600 mt-2 text-sm print:text-black">{experience.description}</p>
                        )}
                      </div>
                    ))}
                    
                    {key === 'project' && sortedItems.map((project) => (
                      <div key={project.id} className="relative pl-6 pb-4 before:absolute before:left-0 before:top-1 before:bottom-0 before:w-px before:bg-blue-200 print:before:bg-gray-400">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-500 print:bg-black"></div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold print:text-base print:text-black">{project.title}</h3>
                          <span className="text-sm text-gray-500 flex items-center print:text-black">
                            <CalendarIcon size={14} className="mr-1" />
                            {formatDateRange(project.startDate, project.endDate, project.present)}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-gray-600 mt-2 text-sm print:text-black">{project.description}</p>
                        )}
                        {project.skills && project.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.skills.map((skill) => (
                              <span key={skill.id} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded print:bg-gray-200 print:text-black print:border print:border-gray-400">
                                {skill.skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="resume-preview-container" className="w-full max-w-4xl mx-auto">
      {selectedTemplate === 'modern' && renderModernTemplate()}
      {selectedTemplate === 'classic' && renderClassicTemplate()}
      {selectedTemplate === 'minimal' && renderMinimalTemplate()}
      {selectedTemplate === 'technical' && renderTechnicalTemplate()}
    </div>
  );
};

export default ResumePreview;
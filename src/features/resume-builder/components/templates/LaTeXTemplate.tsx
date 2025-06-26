import React from 'react';
import { formatDateRange, formatInstitutionLocation } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, BookOpenIcon, CodeIcon, WrenchIcon, UserIcon } from 'lucide-react';
import { Section, EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../../types';

type SectionType = Section<EducationItem> | Section<ExperienceItem> | Section<ProjectItem> | Section<SkillItem>;
type SummarySection = {
  summary: string;
  sectionTitle: string;
  hidden: boolean;
  orderIndex: number;
};

const LaTeXTemplate: React.FC<TemplateProps> = ({ resume }) => {
  // Sort sections by their orderIndex
  const sortedSections = Object.entries({
    summary: resume.summarySection,
    education: resume.educationSection,
    experience: resume.experienceSection,
    project: resume.projectSection,
    skill: resume.skillSection
  }).sort((a, b) => {
    const orderA = resume.sectionsOrder[a[0]] || a[1].orderIndex;
    const orderB = resume.sectionsOrder[b[0]] || b[1].orderIndex;
    return orderA - orderB;
  });

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto font-serif">
      {/* LaTeX-style header */}
      <div className="p-8 text-center border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">
          {resume.personalDetails.fullName}
        </h1>
        <p className="text-lg text-gray-700 mb-4 font-medium">
          {resume.personalDetails.jobTitle}
        </p>
        
        {/* Contact information in LaTeX style */}
        <div className="flex justify-center flex-wrap gap-6 text-gray-600 text-sm">
          <div className="flex items-center">
            <MailIcon size={14} className="mr-1" />
            <span className="font-mono">{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon size={14} className="mr-1" />
            <span className="font-mono">{resume.personalDetails.phone}</span>
          </div>
          {resume.personalDetails.address && (
            <div className="flex items-center">
              <MapPinIcon size={14} className="mr-1" />
              <span className="font-mono">{resume.personalDetails.address}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content with LaTeX-style formatting */}
      <div className="p-8">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          if (key === 'summary') {
            const summarySection = section as SummarySection;
            return (
              <div key={key} className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-gray-800 mr-3"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                    {summarySection.sectionTitle}
                  </h2>
                </div>
                <div className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {summarySection.summary}
                  </p>
                </div>
              </div>
            );
          }
          
          // For other sections, we know they have items
          const typedSection = section as SectionType;
          const sortedItems = [...typedSection.items]
            .filter(item => !item.hidden)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          
          let icon;
          switch (key) {
            case 'education':
              icon = <BookOpenIcon size={18} className="text-gray-700" />;
              break;
            case 'experience':
              icon = <BriefcaseIcon size={18} className="text-gray-700" />;
              break;
            case 'project':
              icon = <CodeIcon size={18} className="text-gray-700" />;
              break;
            case 'skill':
              icon = <WrenchIcon size={18} className="text-gray-700" />;
              break;
            default:
              icon = null;
          }
          
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gray-800 mr-3"></div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                  {typedSection.sectionTitle}
                </h2>
              </div>
              
              <div className="space-y-6">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900">{education.degree}</h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium italic">
                      {formatInstitutionLocation(education.school, education.city, education.country)}
                    </p>
                    {education.description && (
                      <p className="text-gray-700 mt-2 leading-relaxed text-justify">
                        {education.description}
                      </p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => (
                  <div key={experience.id} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900">{experience.jobTitle}</h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium italic">
                      {formatInstitutionLocation(experience.company, experience.city, experience.country)}
                    </p>
                    {experience.description && (
                      <div className="text-gray-700 mt-2 leading-relaxed">
                        {experience.description.split('\n').map((line: string, index: number) => (
                          <p key={index} className="text-justify mb-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {key === 'project' && sortedItems.map((project: any) => {
                  // Only show date if both start and end dates (or present) are available
                  const hasValidDates = project.startDate && (project.endDate || project.present);
                  
                  return (
                    <div key={project.id} className="pl-4 border-l-2 border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-gray-900">{project.title}</h3>
                        {hasValidDates && (
                          <span className="text-sm text-gray-600 font-mono">
                            {formatDateRange(project.startDate, project.endDate, project.present)}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed text-justify">
                          {project.description}
                        </p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-800 font-medium">Technologies: </span>
                          <span className="text-gray-700 font-mono">
                            {project.skills.map((skill: any) => skill.skill).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {key === 'skill' && (
                  <div className="pl-4 border-l-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {sortedItems.map((skill: any) => {
                        const levelValue = {
                          'BEGINNER': 1,
                          'INTERMEDIATE': 2,
                          'ADVANCED': 3,
                          'EXPERT': 4
                        }[skill.level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'] || 0;
                        
                        return (
                          <div key={skill.id} className="flex justify-between items-center">
                            <span className="text-gray-800 font-medium">{skill.skill}</span>
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, index) => (
                                <span 
                                  key={index} 
                                  className={`text-xs ${index < levelValue ? 'text-gray-800' : 'text-gray-300'}`}
                                >
                                  ●
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

export default LaTeXTemplate; 
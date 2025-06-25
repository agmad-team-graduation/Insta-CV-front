import React from 'react';
import { formatDateRange, getSkillLevelBars } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { Section, EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../../types';

type SectionType = Section<EducationItem> | Section<ExperienceItem> | Section<ProjectItem> | Section<SkillItem>;
type SummarySection = {
  summary: string;
  sectionTitle: string;
  hidden: boolean;
  orderIndex: number;
};

const ClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto print:shadow-none print:rounded-none print:max-w-none print:mx-0">
      {/* Header with personal details */}
      <div className="p-8 bg-gray-800 text-white text-center print:p-4 resume-header">
        <h1 className="text-3xl font-bold print:text-2xl">{resume.personalDetails.fullName}</h1>
        
        <div className="mt-4 flex justify-center flex-wrap gap-6 print:mt-2 print:gap-3">
          <div className="flex items-center">
            <MailIcon size={16} className="mr-2" />
            <span className="print:text-sm">{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon size={16} className="mr-2" />
            <span className="print:text-sm">{resume.personalDetails.phone}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon size={16} className="mr-2" />
            <span className="print:text-sm">{resume.personalDetails.address}</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6 print:p-4 resume-content">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          if (key === 'summary') {
            const summarySection = section as SummarySection;
            return (
              <div key={key} className="mb-8 print:mb-4 resume-section">
                <div className="flex items-center mb-4 print:mb-2">
                  <UserIcon size={20} className="text-gray-600 print:w-4 print:h-4" />
                  <h2 className="text-xl font-bold ml-2 text-gray-800 print:text-lg">{summarySection.sectionTitle}</h2>
                </div>
                <p className="text-gray-700 print:text-sm">{summarySection.summary}</p>
              </div>
            );
          }
          
          // For other sections, we know they have items
          const typedSection = section as SectionType;
          const sortedItems = [...typedSection.items]
            .filter(item => !item.hidden)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          
          return (
            <div key={key} className="mb-8 print:mb-4 resume-section">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2 print:text-lg print:mb-2 print:pb-1">
                {typedSection.sectionTitle}
              </h2>
              
              <div className="space-y-4 print:space-y-2">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="mb-4 print:mb-2 compact-spacing">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold print:text-base">{education.degree}</h3>
                      <span className="text-sm text-gray-600 print:text-xs">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-gray-700 print:text-sm">{education.school}, {education.city}, {education.country}</p>
                    {education.description && (
                      <p className="text-gray-600 mt-2 print:mt-1 print:text-xs">{education.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => {
                  if (experience.hidden) return null;
                  return (
                    <div key={experience.id} className="mb-4 print:mb-2 compact-spacing">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold print:text-base">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600 print:text-xs">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 print:text-sm">{experience.company}, {experience.city}, {experience.country}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2 print:mt-1 print:text-xs">{experience.description}</p>
                      )}
                    </div>
                  );
                })}
                
                {key === 'project' && sortedItems.map((project: any) => (
                  <div key={project.id} className="mb-4 print:mb-2 compact-spacing">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold print:text-base">{project.title}</h3>
                      <span className="text-sm text-gray-600 print:text-xs">
                        {formatDateRange(project.startDate, project.endDate, project.present)}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 mt-2 print:mt-1 print:text-xs">{project.description}</p>
                    )}
                    {project.skills && project.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 print:mt-1 print:gap-1">
                        {project.skills.map((skill: any) => (
                          <span key={skill.id} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded print:px-1 print:py-0.5">
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {key === 'skill' && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 print:gap-x-4 print:gap-y-2">
                    {sortedItems.map((skill: any) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-gray-800 print:text-sm">{skill.skill}</span>
                        <span className="text-gray-600 print:text-sm">{getSkillLevelBars(skill.level)}</span>
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

export default ClassicTemplate; 
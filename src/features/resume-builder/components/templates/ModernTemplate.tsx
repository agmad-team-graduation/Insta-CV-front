import React from 'react';
import { formatDateRange, getSkillLevelBars, formatInstitutionLocation } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, BriefcaseIcon, BookOpenIcon, CodeIcon, WrenchIcon, UserIcon, MapPinIcon } from 'lucide-react';
import { Section, EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../../types';

type SectionType = Section<EducationItem> | Section<ExperienceItem> | Section<ProjectItem> | Section<SkillItem>;
type SummarySection = {
  summary: string;
  sectionTitle: string;
  hidden: boolean;
  orderIndex: number;
};

const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header with personal details */}
      <div className="p-6 bg-blue-700 text-white text-center">
        <h1 className="text-3xl font-bold">{resume.personalDetails.fullName}</h1>
        <p className="text-lg text-blue-100 mt-1">{resume.personalDetails.jobTitle}</p>
        
        <div className="mt-4 flex justify-center flex-wrap gap-4">
          <div className="flex items-center">
            <MailIcon size={16} className="mr-2" />
            <span>{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon size={16} className="mr-2" />
            <span>{resume.personalDetails.phone}</span>
          </div>
          {resume.personalDetails.address && (
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.address}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          if (key === 'summary') {
            const summarySection = section as SummarySection;
            return (
              <div key={key} className="mb-6">
                <div className="flex items-center mb-3">
                  <UserIcon size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold ml-2 text-gray-800">{summarySection.sectionTitle}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{summarySection.summary}</p>
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
            <div key={key} className="mb-6">
              <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-lg font-bold ml-2 text-gray-800">{typedSection.sectionTitle}</h2>
              </div>
              
              <div className="space-y-4">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold">{education.degree}</h3>
                      <span className="text-sm text-gray-600">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{formatInstitutionLocation(education.school, education.city, education.country)}</p>
                    {education.description && (
                      <p className="text-gray-600 mt-2 leading-relaxed">{education.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => {
                  if (experience.hidden) return null;
                  return (
                    <div key={experience.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{formatInstitutionLocation(experience.company, experience.city, experience.country)}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2 leading-relaxed">{experience.description}</p>
                      )}
                    </div>
                  );
                })}
                
                {key === 'project' && sortedItems.map((project: any) => {
                  // Only show date if both start and end dates (or present) are available
                  const hasValidDates = project.startDate && (project.endDate || project.present);
                  
                  return (
                    <div key={project.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold">{project.title}</h3>
                        {hasValidDates && (
                          <span className="text-sm text-gray-600">
                            {formatDateRange(project.startDate, project.endDate, project.present)}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-600 mt-2 leading-relaxed">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.skills.map((skill: any) => (
                            <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {key === 'skill' && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {sortedItems.map((skill: any) => {
                      const levelValue = {
                        'BEGINNER': 1,
                        'INTERMEDIATE': 2,
                        'ADVANCED': 3,
                        'EXPERT': 4
                      }[skill.level] || 0;
                      
                      return (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-800">{skill.skill}</span>
                          <div className="flex gap-0.5">
                            {[...Array(4)].map((_, index) => (
                              <span 
                                key={index} 
                                className={`text-xs ${index < levelValue ? 'text-blue-600' : 'text-gray-300'}`}
                              >
                                ●
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
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

export default ModernTemplate; 
import React from 'react';
import { formatDateRange, getSkillLevelBars, formatLocation } from '../../utils/formatters';
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

const HunterGreenTemplate: React.FC<TemplateProps> = ({ resume }) => {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto">
      {/* Header with personal details */}
      <div className="p-8 bg-gradient-to-r from-green-800 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{resume.personalDetails.fullName}</h1>
            <div className="flex items-center text-green-100">
              <MapPinIcon size={16} className="mr-2" />
              <span className="text-lg">{formatLocation(resume.personalDetails.address)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <MailIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.email}</span>
            </div>
            <div className="flex items-center justify-end">
              <PhoneIcon size={16} className="mr-2" />
              <span>{resume.personalDetails.phone}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Multi-column layout */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left Column - Education & Skills */}
        <div className="col-span-1 space-y-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden || (key !== 'education' && key !== 'skill' && key !== 'summary')) return null;
            
            if (key === 'summary') {
              const summarySection = section as SummarySection;
              return (
                <div key={key} className="mb-6">
                  <div className="flex items-center mb-3 pb-2 border-b-2 border-green-200">
                    <UserIcon size={18} className="text-green-700" />
                    <h2 className="text-lg font-bold ml-2 text-green-800">{summarySection.sectionTitle}</h2>
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
                icon = <BookOpenIcon size={18} className="text-green-700" />;
                break;
              case 'skill':
                icon = <WrenchIcon size={18} className="text-green-700" />;
                break;
              default:
                icon = null;
            }
            
            return (
              <div key={key} className="mb-6">
                <div className="flex items-center mb-3 pb-2 border-b-2 border-green-200">
                  {icon}
                  <h2 className="text-lg font-bold ml-2 text-green-800">{typedSection.sectionTitle}</h2>
                </div>
                
                <div className="space-y-3">
                  {key === 'education' && sortedItems.map((education: any) => (
                    <div key={education.id} className="bg-green-50 rounded-lg p-3">
                      <h3 className="font-semibold text-gray-800 text-sm">{education.degree}</h3>
                      <p className="text-gray-600 text-sm">{education.school}</p>
                      <p className="text-gray-500 text-xs">{formatLocation(education.city, education.country)}</p>
                      <p className="text-green-700 text-xs font-medium mt-1">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </p>
                      {education.description && (
                        <p className="text-gray-600 text-xs mt-2">{education.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'skill' && (
                    <div className="space-y-2">
                      {sortedItems.map((skill: any) => {
                        const levelValue = {
                          'BEGINNER': 1,
                          'INTERMEDIATE': 2,
                          'ADVANCED': 3,
                          'EXPERT': 4
                        }[skill.level] || 0;
                        
                        return (
                          <div key={skill.id} className="bg-green-50 rounded-lg p-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 text-sm font-medium">{skill.skill}</span>
                              <div className="flex gap-0.5">
                                {[...Array(4)].map((_, index) => (
                                  <span 
                                    key={index} 
                                    className={`text-xs ${index < levelValue ? 'text-green-700' : 'text-green-300'}`}
                                  >
                                    ●
                                  </span>
                                ))}
                              </div>
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
        
        {/* Right Column - Experience & Projects */}
        <div className="col-span-2 space-y-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden || (key !== 'experience' && key !== 'project')) return null;
            
            // For other sections, we know they have items
            const typedSection = section as SectionType;
            const sortedItems = [...typedSection.items]
              .filter(item => !item.hidden)
              .sort((a, b) => a.orderIndex - b.orderIndex);
            
            let icon;
            switch (key) {
              case 'experience':
                icon = <BriefcaseIcon size={18} className="text-green-700" />;
                break;
              case 'project':
                icon = <CodeIcon size={18} className="text-green-700" />;
                break;
              default:
                icon = null;
            }
            
            return (
              <div key={key} className="mb-6">
                <div className="flex items-center mb-4 pb-2 border-b-2 border-green-200">
                  {icon}
                  <h2 className="text-xl font-bold ml-2 text-green-800">{typedSection.sectionTitle}</h2>
                </div>
                
                <div className="space-y-4">
                  {key === 'experience' && sortedItems.map((experience: any) => (
                    <div key={experience.id} className="border-l-4 border-green-600 pl-4 py-2 bg-green-50 rounded-r-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-green-800">{experience.jobTitle}</h3>
                        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                          {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">{experience.company}</p>
                      <p className="text-gray-500 text-sm">{formatLocation(experience.city, experience.country)}</p>
                      {experience.description && (
                        <p className="text-gray-600 mt-2 leading-relaxed">{experience.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {key === 'project' && sortedItems.map((project: any) => {
                    // Only show date if both start and end dates (or present) are available
                    const hasValidDates = project.startDate && (project.endDate || project.present);
                    
                    return (
                      <div key={project.id} className="border-l-4 border-green-600 pl-4 py-2 bg-green-50 rounded-r-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-semibold text-green-800">{project.title}</h3>
                          {hasValidDates && (
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
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
                              <span key={skill.id} className="px-2 py-1 bg-green-700 text-white text-xs rounded-full">
                                {skill.skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HunterGreenTemplate; 
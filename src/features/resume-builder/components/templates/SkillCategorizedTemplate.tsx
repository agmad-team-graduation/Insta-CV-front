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

const SkillCategorizedTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  // Categorize skills by level
  const categorizeSkills = (skills: SkillItem[]) => {
    const categories = {
      'EXPERT': [] as SkillItem[],
      'ADVANCED': [] as SkillItem[],
      'INTERMEDIATE': [] as SkillItem[],
      'BEGINNER': [] as SkillItem[]
    };

    skills.forEach(skill => {
      if (skill.level && categories[skill.level as keyof typeof categories]) {
        categories[skill.level as keyof typeof categories].push(skill);
      }
    });

    return categories;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'text-gray-900';
      case 'ADVANCED':
        return 'text-gray-800';
      case 'INTERMEDIATE':
        return 'text-gray-700';
      case 'BEGINNER':
        return 'text-gray-600';
      default:
        return 'text-gray-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return <span className="text-gray-700 font-semibold text-sm">EXPERT</span>;
      case 'ADVANCED':
        return <span className="text-gray-600 font-semibold text-sm">ADVANCED</span>;
      case 'INTERMEDIATE':
        return <span className="text-gray-500 font-semibold text-sm">INTERMEDIATE</span>;
      case 'BEGINNER':
        return <span className="text-gray-400 font-semibold text-sm">BEGINNER</span>;
      default:
        return <WrenchIcon size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header with personal details */}
      <div className="p-8 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{resume.personalDetails.fullName}</h1>
          <p className="text-lg text-gray-200 mb-6">{resume.personalDetails.jobTitle}</p>
          
          <div className="flex justify-center flex-wrap gap-6 text-gray-200">
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
      </div>
      
      {/* Main content */}
      <div className="p-8">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          if (key === 'summary') {
            const summarySection = section as SummarySection;
            return (
              <div key={key} className="mb-8">
                <div className="flex items-center mb-4">
                  <UserIcon size={20} className="text-gray-600" />
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
              icon = <BookOpenIcon size={20} className="text-gray-600" />;
              break;
            case 'experience':
              icon = <BriefcaseIcon size={20} className="text-gray-600" />;
              break;
            case 'project':
              icon = <CodeIcon size={20} className="text-gray-600" />;
              break;
            case 'skill':
              icon = <WrenchIcon size={20} className="text-gray-600" />;
              break;
            default:
              icon = null;
          }
          
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-lg font-bold ml-2 text-gray-800">{typedSection.sectionTitle}</h2>
              </div>
              
              <div className="space-y-6">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="border-l-4 border-gray-600 pl-4 py-2">
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
                    <div key={experience.id} className="border-l-4 border-gray-600 pl-4 py-2">
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
                    <div key={project.id} className="border-l-4 border-gray-600 pl-4 py-2">
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
                            <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {key === 'skill' && (() => {
                  const categorizedSkills = categorizeSkills(sortedItems as SkillItem[]);
                  const hasSkills = Object.values(categorizedSkills).some(skills => skills.length > 0);
                  
                  if (!hasSkills) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <WrenchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No skills added yet</p>
                        <p className="text-sm">Add your first skill to get started</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {Object.entries(categorizedSkills).map(([level, skills]) => {
                        if (skills.length === 0) return null;
                        
                        return (
                          <div key={level} className="mb-4">
                            <div className="flex items-center mb-2">
                              {getLevelIcon(level)}
                              {/* <span className="ml-2 text-sm text-gray-500">({skills.length})</span> */}
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {skills.map((skill) => (
                                <span 
                                  key={skill.id} 
                                  className={`${getLevelColor(level)}`}
                                >
                                  {skill.skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillCategorizedTemplate; 
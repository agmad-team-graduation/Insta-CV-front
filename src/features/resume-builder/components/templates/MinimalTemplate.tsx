import React from 'react';
import { formatDateRange, getSkillLevelBars } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header with personal details */}
      <div className="p-8 border-b">
        <h1 className="text-3xl font-bold text-gray-900">{resume.personalDetails.fullName}</h1>
        
        <div className="mt-4 flex flex-wrap gap-6 text-gray-600">
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
        <div className="p-6 border-b">
          <p className="text-gray-700">{resume.summary}</p>
        </div>
      )}
      
      {/* Main content */}
      <div className="p-6">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          // Sort items by orderIndex
          const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
          
          return (
            <div key={key} className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                {section.sectionTitle}
              </h2>
              
              <div className="space-y-4">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="mb-4">
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
                
                {key === 'experience' && sortedItems.map((experience: any) => {
                  if (experience.hidden) return null;
                  return (
                    <div key={experience.id} className="mb-4">
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
                  );
                })}
                
                {key === 'project' && sortedItems.map((project: any) => (
                  <div key={project.id} className="mb-4">
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
                      <div className="mt-2">
                        <span className="text-gray-700">
                          {project.skills.map((skill: any) => skill.skill).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                
                {key === 'skill' && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {sortedItems.map((skill: any) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-gray-800">{skill.skill}</span>
                        <span className="text-gray-600">{getSkillLevelBars(skill.level)}</span>
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

export default MinimalTemplate; 
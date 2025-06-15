import React from 'react';
import { formatDateRange, getSkillLevelBars } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

const TechnicalTemplate: React.FC<TemplateProps> = ({ resume, previewRef }) => {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
      {/* Header with personal details */}
      <div className="p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold font-mono">{resume.personalDetails.fullName}</h1>
        
        <div className="mt-4 flex flex-wrap gap-6 text-gray-300">
          <div className="flex items-center">
            <MailIcon size={16} className="mr-2" />
            <span className="font-mono">{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon size={16} className="mr-2" />
            <span className="font-mono">{resume.personalDetails.phone}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon size={16} className="mr-2" />
            <span className="font-mono">{resume.personalDetails.address}</span>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      {resume.summary && !resume.summaryHidden && (
        <div className="p-6 bg-gray-100 border-b">
          <h2 className="text-xl font-bold mb-3 text-gray-800 font-mono">// {resume.summaryTitle || 'Summary'}</h2>
          <p className="text-gray-700 font-mono">{resume.summary}</p>
        </div>
      )}
      
      {/* Main content */}
      <div className="p-6">
        {sortedSections.map(([key, section]) => {
          if (section.hidden) return null;
          
          // Sort items by orderIndex and filter out hidden items
          const sortedItems = [...section.items]
            .filter(item => !item.hidden)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          
          return (
            <div key={key} className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 font-mono">// {section.sectionTitle}</h2>
              
              <div className="space-y-6">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold font-mono">{education.degree}</h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-gray-700 font-mono">{education.school}, {education.city}, {education.country}</p>
                    {education.description && (
                      <p className="text-gray-600 mt-2 font-mono">{education.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => (
                  <div key={experience.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold font-mono">{experience.jobTitle}</h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                      </span>
                    </div>
                    <p className="text-gray-700 font-mono">{experience.company}, {experience.city}, {experience.country}</p>
                    {experience.description && (
                      <p className="text-gray-600 mt-2 font-mono">{experience.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'project' && sortedItems.map((project: any) => (
                  <div key={project.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold font-mono">{project.title}</h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {formatDateRange(project.startDate, project.endDate, project.present)}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 mt-2 font-mono">{project.description}</p>
                    )}
                    {project.skills && project.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.skills.map((skill: any) => (
                          <span key={skill.id} className="px-2 py-1 bg-gray-900 text-gray-300 text-xs rounded font-mono">
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {key === 'skill' && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {sortedItems.map((skill: any) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-gray-800 font-mono">{skill.skill}</span>
                        <span className="text-gray-600 font-mono">{getSkillLevelBars(skill.level)}</span>
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

export default TechnicalTemplate; 
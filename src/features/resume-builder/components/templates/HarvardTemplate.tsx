import React from 'react';
import { formatDateRange } from '../../utils/formatters';
import { TemplateProps } from './index';

const HarvardTemplate: React.FC<TemplateProps> = ({ resume }) => {
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto font-serif">
      {/* Header with personal details - Harvard style */}
      <div className="p-8 text-center border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{resume.personalDetails.fullName}</h1>
        
        <div className="flex justify-center flex-wrap gap-6 text-gray-700 text-sm">
          <span>{resume.personalDetails.address}</span>
          <span>•</span>
          <span>{resume.personalDetails.phone}</span>
          <span>•</span>
          <span>{resume.personalDetails.email}</span>
        </div>
      </div>
      
      {/* Summary */}
      {resume.summary && !resume.summaryHidden && (
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase tracking-wide">{resume.summaryTitle || 'OBJECTIVE'}</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
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
            <div key={key} className="mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1">
                {section.sectionTitle}
              </h2>
              
              <div className="space-y-4">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{education.degree}</h3>
                      <span className="text-gray-700 text-sm">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">{education.school}, {education.city}, {education.country}</p>
                    {education.description && (
                      <p className="text-gray-700 mt-2 leading-relaxed">{education.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => (
                  <div key={experience.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{experience.jobTitle}</h3>
                      <span className="text-gray-700 text-sm">
                        {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium italic">{experience.company}, {experience.city}, {experience.country}</p>
                    {experience.description && (
                      <p className="text-gray-700 mt-2 leading-relaxed">{experience.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'project' && sortedItems.map((project: any) => (
                  <div key={project.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <span className="text-gray-700 text-sm">
                        {formatDateRange(project.startDate, project.endDate, project.present)}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                    )}
                    {project.skills && project.skills.length > 0 && (
                      <div className="mt-2">
                        <span className="text-gray-800 font-medium">Skills: </span>
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
                        <span className="text-gray-600 capitalize text-sm">{skill.level.toLowerCase()}</span>
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

export default HarvardTemplate; 
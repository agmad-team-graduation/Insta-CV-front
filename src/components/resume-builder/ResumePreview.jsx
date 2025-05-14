import React from 'react';
import { EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline'; // Using Heroicons v2
import { MapPinIcon } from '@heroicons/react/24/outline'; // Also using Heroicons v2

const ResumePreview = ({ resume, selectedTemplate, sortedSections, formatDateRange, getSkillLevelBars }) => {
  
  const previewRef = React.useRef(null);

  const renderModernTemplate = () => {
    return (
      <div className="bg-white shadow-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 bg-gray-800 text-white text-center">
          <h1 className="text-3xl font-bold">{resume.personalDetails.fullName}</h1>
          
          <div className="mt-4 flex justify-center flex-wrap gap-6">
            <div className="flex items-center">
              <EnvelopeIcon size={16} className="mr-2" />
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
          <div className="p-6 bg-gray-100 border-b">
            <p className="text-gray-700 text-center italic">{resume.summary}</p>
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
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">{section.sectionTitle}</h2>
                
                <div className="space-y-6">
                  {key === 'education' && sortedItems.map((education) => (
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
                   {/* Repeat for other sections... */}
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
      <div className="bg-white shadow-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
        {/* Header with personal details */}
        <div className="p-8 border-b">
          <h1 className="text-3xl font-bold text-gray-900">{resume.personalDetails.fullName}</h1>
          
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center">
              <EnvelopeIcon size={16} className="mr-2" />
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-700">{resume.summary}</p>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {sortedSections.map(([key, section]) => {
            if (section.hidden) return null;
            
            const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
            
            return (
              <div key={key} className="mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 uppercase tracking-wider">{section.sectionTitle}</h2>
                
                <div className="space-y-4">
                  {/* Repeat for other sections... */}
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
      <div className="bg-white shadow-lg overflow-hidden max-w-4xl mx-auto" ref={previewRef}>
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="bg-gray-800 text-white p-6 md:w-1/3">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">{resume.personalDetails.fullName}</h1>
              <p className="text-gray-300 mt-1">{resume.personalDetails.address}</p>
               <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <EnvelopeIcon size={14} className="mr-2" />
                  <span>{resume.personalDetails.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon size={14} className="mr-2" />
                  <span>{resume.personalDetails.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon size={14} className="mr-2" />
                  <span>{resume.personalDetails.address}</span>
                </div>
              </div>
            </div>
            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              {resume.skills && (
                <div className="space-y-3">
                  {resume.skills.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center">
                      <span>{skill.skill}</span>
                      <span>{getSkillLevelBars(skill.level)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:w-2/3">
            {sortedSections.map(([key, section]) => {
              if (section.hidden) return null;
              const sortedItems = [...section.items].sort((a, b) => a.orderIndex - b.orderIndex);
              
              return (
                <div key={key} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800">{section.sectionTitle}</h2>
                   <div className="space-y-6">
                     {/* Repeat for other sections... */}
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
    <>
      {selectedTemplate === 'modern' && renderModernTemplate()}
      {selectedTemplate === 'classic' && renderClassicTemplate()}
      {selectedTemplate === 'technical' && renderTechnicalTemplate()}
    </>
  );
};

export default ResumePreview;

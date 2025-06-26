import React from 'react';
import { formatDateRange, getSkillLevelBars, formatLocation } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, BookOpenIcon, CodeIcon, WrenchIcon, UserIcon } from 'lucide-react';
import { Section, EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../../types';
import apiClient from '@/common/utils/apiClient';

type SectionType = Section<EducationItem> | Section<ExperienceItem> | Section<ProjectItem> | Section<SkillItem>;
type SummarySection = {
  summary: string;
  sectionTitle: string;
  hidden: boolean;
  orderIndex: number;
};

const AtlanticBlueTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = React.useState(false);
  const [photoDataUrl, setPhotoDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const existsResponse = await apiClient.get('/api/users/photo/exists');
        if (existsResponse.data.exists) {
          const photoResponse = await apiClient.get('/api/users/photo');
          setPhotoUrl(photoResponse.data.photoUrl);
          setHasPhoto(true);
          
          // Convert image to base64 for PDF compatibility
          try {
            const response = await fetch(photoResponse.data.photoUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              setPhotoDataUrl(reader.result as string);
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error('Error converting image to base64:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
      }
    };
    fetchPhoto();
  }, []);

  // Add CSS for PDF printing
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Screen styles for preview */
      .pdf-image {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        border-radius: 50% !important;
        overflow: hidden !important;
        border: none !important;
        outline: none !important;
      }
      .pdf-image-container {
        border-radius: 50% !important;
        overflow: hidden !important;
        border: none !important;
        outline: none !important;
      }
      
      /* Ensure icons are visible in both screen and print */
      .print-icon {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-width: 16px !important;
        min-height: 16px !important;
        width: auto !important;
        height: auto !important;
        transform: none !important;
        transform-origin: center !important;
      }
      
      /* Specific icon size fixes */
      .print-icon svg {
        min-width: 16px !important;
        min-height: 16px !important;
        width: 16px !important;
        height: 16px !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
        transform-origin: center !important;
      }
      
      /* Larger icons for section headers */
      .print-icon-large {
        min-width: 20px !important;
        min-height: 20px !important;
      }
      
      .print-icon-large svg {
        min-width: 20px !important;
        min-height: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
      
      /* User icon in profile */
      .print-icon-user {
        min-width: 48px !important;
        min-height: 48px !important;
      }
      
      .print-icon-user svg {
        min-width: 48px !important;
        min-height: 48px !important;
        width: 48px !important;
        height: 48px !important;
      }
      
      /* Fix layout for both screen and print - ensure proper column widths */
      .print-layout {
        display: flex !important;
        width: 100% !important;
        max-width: none !important;
      }
      
      .print-sidebar {
        width: 33.333% !important;
        min-width: 33.333% !important;
        max-width: 33.333% !important;
        flex-shrink: 0 !important;
      }
      
      .print-main {
        width: 66.667% !important;
        flex: 1 !important;
      }
      
      /* Ensure text colors are preserved */
      .print-text-white {
        color: white !important;
      }
      
      .print-text-slate-300 {
        color: #cbd5e1 !important;
      }
      
      .print-bg-slate-800 {
        background-color: #1e293b !important;
      }
      
      /* Print-specific styles */
      @media print {
        .pdf-image {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .print-icon {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .print-text-white {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .print-text-slate-300 {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        .print-bg-slate-800 {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Remove shadows and borders for clean print */
        .print-no-shadow {
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        
        /* Ensure proper spacing in print */
        .print-spacing {
          margin: 0 !important;
          padding: 1rem !important;
        }
      }
      
      /* Screen-specific optimizations for better viewing */
      @media screen {
        .print-layout {
          font-size: 14px;
          line-height: 1.4;
        }
        
        .print-sidebar {
          padding: 1.5rem !important;
        }
        
        .print-main {
          padding: 1.5rem !important;
        }
        
        /* Improve text sizing for screen */
        .print-sidebar h1 {
          font-size: 1.5rem !important;
          line-height: 1.2 !important;
        }
        
        .print-sidebar h2 {
          font-size: 1.1rem !important;
          line-height: 1.2 !important;
        }
        
        .print-sidebar p,
        .print-sidebar span {
          font-size: 0.875rem !important;
          line-height: 1.4 !important;
        }
        
        .print-main h2 {
          font-size: 1.25rem !important;
          line-height: 1.2 !important;
        }
        
        .print-main h3 {
          font-size: 1.1rem !important;
          line-height: 1.2 !important;
        }
        
        .print-main p {
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
        }
        
        /* Improve icon sizing for screen */
        .print-icon svg {
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          min-height: 18px !important;
        }
        
        .print-icon-large svg {
          width: 22px !important;
          height: 22px !important;
          min-width: 22px !important;
          min-height: 22px !important;
        }
        
        .print-icon-user svg {
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
        }
        
        /* Improve spacing for screen */
        .print-sidebar .mb-8 {
          margin-bottom: 1.5rem !important;
        }
        
        .print-sidebar .mb-3 {
          margin-bottom: 0.75rem !important;
        }
        
        .print-main .mb-8 {
          margin-bottom: 1.5rem !important;
        }
        
        .print-main .mb-6 {
          margin-bottom: 1.25rem !important;
        }
        
        .print-main .space-y-6 > * + * {
          margin-top: 1.25rem !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    <div className="flex print-layout print-no-shadow bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto">
      {/* Left Sidebar */}
      <div className="w-1/3 print-sidebar print-bg-slate-800 print-spacing bg-slate-800 text-white p-8">
        {/* Header with name and title */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-4 overflow-hidden pdf-image-container">
            {hasPhoto && (photoDataUrl || photoUrl) ? (
              <img 
                src={photoDataUrl || photoUrl || ''} 
                alt={resume.personalDetails.fullName}
                className="w-full h-full object-cover pdf-image"
                style={{ 
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact',
                  colorAdjust: 'exact',
                  display: 'block',
                  visibility: 'visible',
                  border: 'none',
                  outline: 'none',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
                crossOrigin="anonymous"
                onLoad={() => {
                  // Force re-render after image loads
                  setTimeout(() => {
                    const img = document.querySelector('.pdf-image') as HTMLImageElement;
                    if (img) {
                      img.style.display = 'block';
                      img.style.visibility = 'visible';
                      img.style.border = 'none';
                      img.style.outline = 'none';
                    }
                  }, 100);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon size={48} className="text-slate-300 print-text-slate-300 print-icon print-icon-user" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2 print-text-white">{resume.personalDetails.fullName}</h1>
          <p className="text-slate-300 text-lg print-text-slate-300">{resume.personalDetails.jobTitle || 'Job Title?'}</p>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <MailIcon size={16} className="mr-3 text-slate-300 print-text-slate-300 print-icon" />
            <span className="text-sm print-text-slate-300">{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center mb-3">
            <PhoneIcon size={16} className="mr-3 text-slate-300 print-text-slate-300 print-icon" />
            <span className="text-sm print-text-slate-300">{resume.personalDetails.phone}</span>
          </div>
          <div className="flex items-center mb-3">
            <MapPinIcon size={16} className="mr-3 text-slate-300 print-text-slate-300 print-icon" />
            <span className="text-sm print-text-slate-300">{resume.personalDetails.address}</span>
          </div>
        </div>

        {/* Profile/Summary */}
        {sortedSections.map(([key, section]) => {
          if (section.hidden || key !== 'summary') return null;
          
          const summarySection = section as SummarySection;
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center mb-4">
                <UserIcon size={20} className="mr-3 text-slate-300 print-text-slate-300 print-icon print-icon-large" />
                <h2 className="text-lg font-bold text-white print-text-white">{summarySection.sectionTitle}</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed print-text-slate-300">{summarySection.summary}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="w-2/3 print-main print-spacing p-8">
        {sortedSections.map(([key, section]) => {
          if (section.hidden || key === 'summary') return null;
          
          // For other sections, we know they have items
          const typedSection = section as SectionType;
          const sortedItems = [...typedSection.items]
            .filter(item => !item.hidden)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          
          let icon;
          let iconColor = "text-slate-600";
          switch (key) {
            case 'education':
              icon = <BookOpenIcon size={20} className={`${iconColor} print-icon print-icon-large`} />;
              break;
            case 'experience':
              icon = <BriefcaseIcon size={20} className={`${iconColor} print-icon print-icon-large`} />;
              break;
            case 'project':
              icon = <CodeIcon size={20} className={`${iconColor} print-icon print-icon-large`} />;
              break;
            case 'skill':
              icon = <WrenchIcon size={20} className={`${iconColor} print-icon print-icon-large`} />;
              break;
            default:
              icon = null;
          }
          
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center mb-6">
                {icon}
                <h2 className="text-xl font-bold ml-3 text-slate-800 uppercase tracking-wide">
                  {typedSection.sectionTitle}
                </h2>
              </div>
              
              <div className="space-y-6">
                {key === 'education' && sortedItems.map((education: any) => (
                  <div key={education.id} className="border-l-2 border-slate-300 pl-6 relative">
                    <div className="absolute w-3 h-3 bg-slate-600 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{education.degree}</h3>
                      <span className="text-sm text-slate-600 font-medium">
                        {formatDateRange(education.startDate, education.endDate, education.present)}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{education.school}</p>
                    <p className="text-slate-600 text-sm">{formatLocation(education.city, education.country)}</p>
                    {education.description && (
                      <p className="text-slate-600 mt-2 text-sm">{education.description}</p>
                    )}
                  </div>
                ))}
                
                {key === 'experience' && sortedItems.map((experience: any) => (
                  <div key={experience.id} className="border-l-2 border-slate-300 pl-6 relative">
                    <div className="absolute w-3 h-3 bg-slate-600 rounded-full -left-2 top-1"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{experience.jobTitle}</h3>
                      <span className="text-sm text-slate-600 font-medium">
                        {formatDateRange(experience.startDate, experience.endDate, experience.present)}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{experience.company}</p>
                    <p className="text-slate-600 text-sm mb-3">{formatLocation(experience.city, experience.country)}</p>
                    {experience.description && (
                      <div className="text-slate-600 text-sm">
                        {experience.description.split('\n').map((line: string, index: number) => (
                          <div key={index} className="flex items-start mb-1">
                            <span className="text-slate-400 mr-2">•</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {key === 'project' && sortedItems.map((project: any) => {
                  // Only show date if both start and end dates (or present) are available
                  const hasValidDates = project.startDate && (project.endDate || project.present);
                  
                  return (
                    <div key={project.id} className="border-l-2 border-slate-300 pl-6 relative">
                      <div className="absolute w-3 h-3 bg-slate-600 rounded-full -left-2 top-1"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{project.title}</h3>
                        {hasValidDates && (
                          <span className="text-sm text-slate-600 font-medium">
                            {formatDateRange(project.startDate, project.endDate, project.present)}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-slate-600 text-sm mb-3">{project.description}</p>
                      )}
                      {project.skills && project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill: any) => (
                            <span key={skill.id} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
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
                    {sortedItems.map((skill: any) => (
                      <div key={skill.id} className="flex items-center">
                        <span className="text-slate-400 mr-2">•</span>
                        <span className="text-slate-800 font-medium">{skill.skill}</span>
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

export default AtlanticBlueTemplate; 
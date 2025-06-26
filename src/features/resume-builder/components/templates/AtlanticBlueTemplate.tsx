import React from 'react';
import { formatDateRange, getSkillLevelBars } from '../../utils/formatters';
import { TemplateProps } from './index';
import { MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, BookOpenIcon, CodeIcon, WrenchIcon, GlobeIcon, AwardIcon, UserIcon } from 'lucide-react';
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

  React.useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const existsResponse = await apiClient.get('/api/users/photo/exists');
        if (existsResponse.data.exists) {
          const photoResponse = await apiClient.get('/api/users/photo');
          setPhotoUrl(photoResponse.data.photoUrl);
          setHasPhoto(true);
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
      }
    };
    fetchPhoto();
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-800 text-white p-8">
        {/* Header with name and title */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-slate-600 rounded-full mx-auto mb-4 overflow-hidden">
            {hasPhoto && photoUrl ? (
              <img 
                src={photoUrl} 
                alt={resume.personalDetails.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon size={48} className="text-slate-300" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{resume.personalDetails.fullName}</h1>
          <p className="text-slate-300 text-lg">{resume.personalDetails.jobTitle || 'Job Title?'}</p>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <MailIcon size={16} className="mr-3 text-slate-300" />
            <span className="text-sm">{resume.personalDetails.email}</span>
          </div>
          <div className="flex items-center mb-3">
            <PhoneIcon size={16} className="mr-3 text-slate-300" />
            <span className="text-sm">{resume.personalDetails.phone}</span>
          </div>
          <div className="flex items-center mb-3">
            <MapPinIcon size={16} className="mr-3 text-slate-300" />
            <span className="text-sm">{resume.personalDetails.address}</span>
          </div>
        </div>

        {/* Profile/Summary */}
        {sortedSections.map(([key, section]) => {
          if (section.hidden || key !== 'summary') return null;
          
          const summarySection = section as SummarySection;
          return (
            <div key={key} className="mb-8">
              <div className="flex items-center mb-4">
                <UserIcon size={20} className="mr-3 text-slate-300" />
                <h2 className="text-lg font-bold text-white">{summarySection.sectionTitle}</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{summarySection.summary}</p>
            </div>
          );
        })}

        {/* Languages Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <GlobeIcon size={20} className="mr-3 text-slate-300" />
            <h2 className="text-lg font-bold text-white">LANGUAGES</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 text-sm">English</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div key={dot} className="w-2 h-2 rounded-full bg-slate-300"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 text-sm">Spanish</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((dot) => (
                  <div key={dot} className="w-2 h-2 rounded-full bg-slate-300"></div>
                ))}
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AwardIcon size={20} className="mr-3 text-slate-300" />
            <h2 className="text-lg font-bold text-white">AWARDS</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-slate-300 font-semibold text-sm">Outstanding Business Student Award</h3>
              <p className="text-slate-400 text-xs">University of Southern California, 2014</p>
            </div>
            <div>
              <h3 className="text-slate-300 font-semibold text-sm">Dean's List</h3>
              <p className="text-slate-400 text-xs">University of California, Los Angeles, 2015-2016</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8">
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
              icon = <BookOpenIcon size={20} className={iconColor} />;
              break;
            case 'experience':
              icon = <BriefcaseIcon size={20} className={iconColor} />;
              break;
            case 'project':
              icon = <CodeIcon size={20} className={iconColor} />;
              break;
            case 'skill':
              icon = <WrenchIcon size={20} className={iconColor} />;
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
                    <p className="text-slate-600 text-sm">{education.city}, {education.country}</p>
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
                    <p className="text-slate-600 text-sm mb-3">{experience.city}, {experience.country}</p>
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
                  <div className="grid grid-cols-1 gap-4">
                    {sortedItems.map((skill: any) => (
                      <div key={skill.id} className="flex items-start">
                        <span className="text-slate-400 mr-2">•</span>
                        <div>
                          <span className="text-slate-800 font-medium">{skill.skill}</span>
                        </div>
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
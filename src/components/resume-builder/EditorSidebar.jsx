import React, { useState } from 'react';
import {
  UserIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CodeIcon,
  WrenchIcon,
  PlusIcon,
  EyeOffIcon,
  EyeIcon,
  ArrowUpDownIcon,
  AlertCircleIcon
} from 'lucide-react';
import useResumeStore from '../../store/resumeStore';
import EditableField from '../ui/EditableField';
import EditorAccordion from './EditorAccordion';
import SectionItemEditor from './SectionItemEditor';

function EditorSidebar({ resume }) {
  const {
    updatePersonalDetails,
    updateSummary,
    updateSectionTitle,
    toggleSectionVisibility,
    addItem
  } = useResumeStore();

  const [expandedSections, setExpandedSections] = useState(['personalDetails', 'summary']);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sectionHandlers = {
    educationSection: () => {
      addItem('educationSection', {
        degree: 'New Degree',
        school: 'University Name',
        city: 'City',
        country: 'Country',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: 'Enter your education details here',
        present: false
      });
    },
    experienceSection: () => {
      addItem('experienceSection', {
        jobTitle: 'New Position',
        company: 'Company Name',
        city: 'City',
        country: 'Country',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: 'Enter your responsibilities and achievements here',
        present: false
      });
    },
    projectSection: () => {
      addItem('projectSection', {
        title: 'New Project',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: 'Describe your project here',
        skills: [],
        present: false
      });
    },
    skillSection: () => {
      addItem('skillSection', {
        skill: 'New Skill',
        level: 'INTERMEDIATE'
      });
    }
  };

  const renderSection = (sectionKey, Icon, label, items) => (
    <EditorAccordion
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Icon size={18} />
            <EditableField
              value={resume[sectionKey].sectionTitle}
              onChange={(value) => updateSectionTitle(sectionKey, value)}
              className="!p-0 hover:bg-transparent"
            />
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility(sectionKey);
              }}
              className="p-1 rounded hover:bg-gray-100"
              title={resume[sectionKey].hidden ? 'Show section' : 'Hide section'}
            >
              {resume[sectionKey].hidden ? (
                <EyeOffIcon size={16} className="text-gray-500" />
              ) : (
                <EyeIcon size={16} className="text-blue-600" />
              )}
            </button>
            <button className="p-1 rounded hover:bg-gray-100" title="Drag to reorder section">
              <ArrowUpDownIcon size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      }
      isExpanded={expandedSections.includes(sectionKey)}
      onToggle={() => toggleSection(sectionKey)}
      isCustomTitle
    >
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border rounded-md p-3 bg-white">
            <SectionItemEditor sectionKey={sectionKey} item={item} />
          </div>
        ))}
      </div>
      <button onClick={sectionHandlers[sectionKey]} className="mt-4 w-full btn btn-secondary">
        <PlusIcon size={16} /> Add {label}
      </button>
    </EditorAccordion>
  );

  return (
    <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
      <EditorAccordion
        title="Personal Details"
        icon={<UserIcon size={18} />}
        isExpanded={expandedSections.includes('personalDetails')}
        onToggle={() => toggleSection('personalDetails')}
      >
        <div className="space-y-3">
          <EditableField
            value={resume.personalDetails.fullName}
            onChange={(value) => updatePersonalDetails({ fullName: value })}
            label="Full Name"
          />
          <EditableField
            value={resume.personalDetails.email}
            onChange={(value) => updatePersonalDetails({ email: value })}
            type="email"
            label="Email"
          />
          <EditableField
            value={resume.personalDetails.phone}
            onChange={(value) => updatePersonalDetails({ phone: value })}
            type="tel"
            label="Phone"
          />
          <EditableField
            value={resume.personalDetails.address}
            onChange={(value) => updatePersonalDetails({ address: value })}
            label="Address"
          />
        </div>
      </EditorAccordion>

      <EditorAccordion
        title="Summary"
        icon={<AlertCircleIcon size={18} />}
        isExpanded={expandedSections.includes('summary')}
        onToggle={() => toggleSection('summary')}
      >
        <EditableField
          value={resume.summary}
          onChange={updateSummary}
          multiline
          placeholder="Write a brief professional summary..."
        />
      </EditorAccordion>

      {renderSection('educationSection', BookOpenIcon, 'Education', resume.educationSection.items)}
      {renderSection('experienceSection', BriefcaseIcon, 'Experience', resume.experienceSection.items)}
      {renderSection('projectSection', CodeIcon, 'Project', resume.projectSection.items)}
      {renderSection('skillSection', WrenchIcon, 'Skill', resume.skillSection.items)}
    </div>
  );
}

export default EditorSidebar;
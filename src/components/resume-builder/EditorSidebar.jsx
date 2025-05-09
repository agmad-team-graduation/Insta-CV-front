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
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from '../ui/DraggableItem';
import EditorAccordion from './EditorAccordion';
import SectionItemEditor from './SectionItemEditor';

function EditorSidebar({ resume }) {
  const {
    updatePersonalDetails,
    updateSummary,
    updateSectionTitle,
    toggleSectionVisibility,
    addItem,
    reorderItems
  } = useResumeStore();

  const [expandedSections, setExpandedSections] = useState(['personalDetails', 'summary']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAddEducation = () => {
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
  };

  const handleAddExperience = () => {
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
  };

  const handleAddProject = () => {
    addItem('projectSection', {
      title: 'New Project',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      description: 'Describe your project here',
      skills: [],
      present: false
    });
  };

  const handleAddSkill = () => {
    addItem('skillSection', {
      skill: 'New Skill',
      level: 'INTERMEDIATE'
    });
  };

  const getSectionItemsById = (sectionKey) => {
    switch (sectionKey) {
      case 'educationSection':
        return resume.educationSection.items.map(item => ({ ...item, id: String(item.id) }));
      case 'experienceSection':
        return resume.experienceSection.items.map(item => ({ ...item, id: String(item.id) }));
      case 'projectSection':
        return resume.projectSection.items.map(item => ({ ...item, id: String(item.id) }));
      case 'skillSection':
        return resume.skillSection.items.map(item => ({ ...item, id: String(item.id) }));
      default:
        return [];
    }
  };

  const handleDragEnd = (sectionKey, result) => {
    if (!result.active || !result.over) return;
    
    const activeId = parseInt(result.active.id);
    const overId = parseInt(result.over.id);
    
    if (activeId === overId) return;
    
    let items;
    switch (sectionKey) {
      case 'educationSection':
        items = [...resume.educationSection.items];
        break;
      case 'experienceSection':
        items = [...resume.experienceSection.items];
        break;
      case 'projectSection':
        items = [...resume.projectSection.items];
        break;
      case 'skillSection':
        items = [...resume.skillSection.items];
        break;
      default:
        return;
    }
    
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    
    const newItems = arrayMove(items, oldIndex, newIndex);
    reorderItems(sectionKey, newItems);
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
      {/* Personal Details */}
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
      
      {/* Summary */}
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
      
      {/* Education Section */}
      <EditorAccordion 
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <BookOpenIcon size={18} />
              <EditableField
                value={resume.educationSection.sectionTitle}
                onChange={(value) => updateSectionTitle('educationSection', value)}
                className="!p-0 hover:bg-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility('educationSection');
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={resume.educationSection.hidden ? 'Show section' : 'Hide section'}
              >
                {resume.educationSection.hidden ? (
                  <EyeOffIcon size={16} className="text-gray-500" />
                ) : (
                  <EyeIcon size={16} className="text-blue-600" />
                )}
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100"
                title="Drag to reorder section"
              >
                <ArrowUpDownIcon size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        }
        isExpanded={expandedSections.includes('educationSection')}
        onToggle={() => toggleSection('educationSection')}
        isCustomTitle
      >
        <SortableContext items={getSectionItemsById('educationSection')} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resume.educationSection.items.map((education) => (
              <DraggableItem key={education.id} id={String(education.id)} className="border rounded-md p-3 bg-white">
                <SectionItemEditor 
                  sectionKey="educationSection"
                  item={education}
                />
              </DraggableItem>
            ))}
          </div>
        </SortableContext>
        
        <button
          onClick={handleAddEducation}
          className="mt-4 w-full btn btn-secondary"
        >
          <PlusIcon size={16} />
          Add Education
        </button>
      </EditorAccordion>
      
      {/* Experience Section */}
      <EditorAccordion 
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <BriefcaseIcon size={18} />
              <EditableField
                value={resume.experienceSection.sectionTitle}
                onChange={(value) => updateSectionTitle('experienceSection', value)}
                className="!p-0 hover:bg-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility('experienceSection');
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={resume.experienceSection.hidden ? 'Show section' : 'Hide section'}
              >
                {resume.experienceSection.hidden ? (
                  <EyeOffIcon size={16} className="text-gray-500" />
                ) : (
                  <EyeIcon size={16} className="text-blue-600" />
                )}
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100"
                title="Drag to reorder section"
              >
                <ArrowUpDownIcon size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        }
        isExpanded={expandedSections.includes('experienceSection')}
        onToggle={() => toggleSection('experienceSection')}
        isCustomTitle
      >
        <SortableContext items={getSectionItemsById('experienceSection')} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resume.experienceSection.items.map((experience) => (
              <DraggableItem key={experience.id} id={String(experience.id)} className="border rounded-md p-3 bg-white">
                <SectionItemEditor 
                  sectionKey="experienceSection"
                  item={experience}
                />
              </DraggableItem>
            ))}
          </div>
        </SortableContext>
        
        <button
          onClick={handleAddExperience}
          className="mt-4 w-full btn btn-secondary"
        >
          <PlusIcon size={16} />
          Add Experience
        </button>
      </EditorAccordion>
      
      {/* Projects Section */}
      <EditorAccordion 
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CodeIcon size={18} />
              <EditableField
                value={resume.projectSection.sectionTitle}
                onChange={(value) => updateSectionTitle('projectSection', value)}
                className="!p-0 hover:bg-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility('projectSection');
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={resume.projectSection.hidden ? 'Show section' : 'Hide section'}
              >
                {resume.projectSection.hidden ? (
                  <EyeOffIcon size={16} className="text-gray-500" />
                ) : (
                  <EyeIcon size={16} className="text-blue-600" />
                )}
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100"
                title="Drag to reorder section"
              >
                <ArrowUpDownIcon size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        }
        isExpanded={expandedSections.includes('projectSection')}
        onToggle={() => toggleSection('projectSection')}
        isCustomTitle
      >
        <SortableContext items={getSectionItemsById('projectSection')} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resume.projectSection.items.map((project) => (
              <DraggableItem key={project.id} id={String(project.id)} className="border rounded-md p-3 bg-white">
                <SectionItemEditor 
                  sectionKey="projectSection"
                  item={project}
                />
              </DraggableItem>
            ))}
          </div>
        </SortableContext>
        
        <button
          onClick={handleAddProject}
          className="mt-4 w-full btn btn-secondary"
        >
          <PlusIcon size={16} />
          Add Project
        </button>
      </EditorAccordion>
      
      {/* Skills Section */}
      <EditorAccordion 
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <WrenchIcon size={18} />
              <EditableField
                value={resume.skillSection.sectionTitle}
                onChange={(value) => updateSectionTitle('skillSection', value)}
                className="!p-0 hover:bg-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility('skillSection');
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={resume.skillSection.hidden ? 'Show section' : 'Hide section'}
              >
                {resume.skillSection.hidden ? (
                  <EyeOffIcon size={16} className="text-gray-500" />
                ) : (
                  <EyeIcon size={16} className="text-blue-600" />
                )}
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100"
                title="Drag to reorder section"
              >
                <ArrowUpDownIcon size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        }
        isExpanded={expandedSections.includes('skillSection')}
        onToggle={() => toggleSection('skillSection')}
        isCustomTitle
      >
        <SortableContext items={getSectionItemsById('skillSection')} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resume.skillSection.items.map((skill) => (
              <DraggableItem key={skill.id} id={String(skill.id)} className="border rounded-md p-3 bg-white">
                <SectionItemEditor 
                  sectionKey="skillSection"
                  item={skill}
                />
              </DraggableItem>
            ))}
          </div>
        </SortableContext>
        
        <button
          onClick={handleAddSkill}
          className="mt-4 w-full btn btn-secondary"
        >
          <PlusIcon size={16} />
          Add Skill
        </button>
      </EditorAccordion>
    </div>
  );
}

export default EditorSidebar;
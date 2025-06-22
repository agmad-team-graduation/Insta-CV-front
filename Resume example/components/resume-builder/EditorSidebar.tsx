import React, { useState } from 'react';
import { 
  UserIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  CodeIcon, 
  WrenchIcon, 
  PlusIcon,
  MinusIcon,
  EyeOffIcon,
  EyeIcon,
  ArrowUpDownIcon,
  AlertCircleIcon
} from 'lucide-react';
import { Resume } from '../../types';
import useResumeStore from '../../store/resumeStore';
import EditableField from '../ui/EditableField';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DraggableItem from '../ui/DraggableItem';
import EditorAccordion from './EditorAccordion';
import SectionItemEditor from './SectionItemEditor';

interface EditorSidebarProps {
  resume: Resume;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ resume }) => {
  const {
    updatePersonalDetails,
    updateSummary,
    updateSectionTitle,
    toggleSectionVisibility,
    addItem,
    reorderItems
  } = useResumeStore();

  const [expandedSections, setExpandedSections] = useState<string[]>(['personalDetails', 'summary']);

  const toggleSection = (sectionId: string) => {
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

  const getSectionItemsById = (sectionKey: string) => {
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

  const handleDragEnd = (sectionKey: string, result: any) => {
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

  // Create sortable section components
  const SortableSection = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 1 : 0,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };

  const sections = [
    {
      key: 'educationSection',
      icon: <BookOpenIcon size={18} />,
      title: resume.educationSection.sectionTitle,
      items: resume.educationSection.items,
      hidden: resume.educationSection.hidden,
      addHandler: handleAddEducation
    },
    {
      key: 'experienceSection',
      icon: <BriefcaseIcon size={18} />,
      title: resume.experienceSection.sectionTitle,
      items: resume.experienceSection.items,
      hidden: resume.experienceSection.hidden,
      addHandler: handleAddExperience
    },
    {
      key: 'projectSection',
      icon: <CodeIcon size={18} />,
      title: resume.projectSection.sectionTitle,
      items: resume.projectSection.items,
      hidden: resume.projectSection.hidden,
      addHandler: handleAddProject
    },
    {
      key: 'skillSection',
      icon: <WrenchIcon size={18} />,
      title: resume.skillSection.sectionTitle,
      items: resume.skillSection.items,
      hidden: resume.skillSection.hidden,
      addHandler: handleAddSkill
    }
  ];

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
      
      {/* Draggable Sections */}
      {sections.map((section) => (
        <SortableSection key={section.key} id={section.key}>
          <EditorAccordion 
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <EditableField
                    value={section.title}
                    onChange={(value) => updateSectionTitle(section.key, value)}
                    className="!p-0 hover:bg-transparent"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(section.key);
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                    title={section.hidden ? 'Show section' : 'Hide section'}
                  >
                    {section.hidden ? (
                      <EyeOffIcon size={16} className="text-gray-500" />
                    ) : (
                      <EyeIcon size={16} className="text-blue-600" />
                    )}
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100 cursor-grab"
                    title="Drag to reorder section"
                  >
                    <ArrowUpDownIcon size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            }
            isExpanded={expandedSections.includes(section.key)}
            onToggle={() => toggleSection(section.key)}
            isCustomTitle
          >
            <SortableContext items={getSectionItemsById(section.key)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <DraggableItem key={item.id} id={String(item.id)} className="border rounded-md p-3 bg-white">
                    <SectionItemEditor 
                      sectionKey={section.key}
                      item={item}
                    />
                  </DraggableItem>
                ))}
              </div>
            </SortableContext>
            
            <button
              onClick={section.addHandler}
              className="mt-4 w-full btn btn-secondary"
            >
              <PlusIcon size={16} />
              Add {section.title}
            </button>
          </EditorAccordion>
        </SortableSection>
      ))}
    </div>
  );
};

export default EditorSidebar;
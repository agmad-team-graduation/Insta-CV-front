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
import { Resume } from '../types';
import useResumeStore from '../store/resumeStore';
import EditableField from './ui/EditableField';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './ui/DraggableItem';
import EditorAccordion from './EditorAccordion';
import SectionItemEditor from './SectionItemEditor';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

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
    reorderItems,
    reorderSections
  } = useResumeStore();

  const [expandedSections, setExpandedSections] = useState<string[]>(['personalDetails', 'summary']);

  // DnD sensors for section reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const sectionKeys = ['educationSection', 'experienceSection', 'skillSection', 'projectSection'];
  // Get section order from resume.sectionsOrder or fallback to default order
  const orderedSectionKeys = [...sectionKeys].sort((a, b) => {
    const orderA = resume.sectionsOrder?.[a.replace('Section', '')] ?? 0;
    const orderB = resume.sectionsOrder?.[b.replace('Section', '')] ?? 0;
    return orderA - orderB;
  });

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    const oldIndex = orderedSectionKeys.findIndex((key) => key === active.id);
    const newIndex = orderedSectionKeys.findIndex((key) => key === over.id);
    const newOrderArr = arrayMove(orderedSectionKeys, oldIndex, newIndex);
    // Build new sectionsOrder object
    const newOrderObj: Record<string, number> = {};
    newOrderArr.forEach((key, idx) => {
      newOrderObj[key.replace('Section', '')] = idx + 1;
    });
    reorderSections(newOrderObj);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAddEducation = () => {
    addItem<any>('educationSection', {
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
    addItem<any>('experienceSection', {
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
    addItem<any>('projectSection', {
      title: 'New Project',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      description: 'Describe your project here',
      skills: [],
      present: false
    });
  };

  const handleAddSkill = () => {
    addItem<any>('skillSection', {
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
    
    const newItems = arrayMove(items as any, oldIndex, newIndex);
    reorderItems(sectionKey as any, newItems);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
      <div className="space-y-6 w-full">
        {/* Personal Details */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
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
        </div>
        {/* Summary */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
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
        </div>
        {/* Main Sections: Draggable as cards */}
        <SortableContext items={orderedSectionKeys} strategy={verticalListSortingStrategy}>
          {orderedSectionKeys.map((sectionKey) => {
            let icon, section, addHandler, sectionTitle, hidden;
            let handleItemDragEnd;
            switch (sectionKey) {
              case 'educationSection':
                icon = <BookOpenIcon size={18} />;
                section = resume.educationSection;
                addHandler = handleAddEducation;
                sectionTitle = section.sectionTitle;
                hidden = section.hidden;
                handleItemDragEnd = (event: DragEndEvent) => handleDragEnd('educationSection', event);
                break;
              case 'experienceSection':
                icon = <BriefcaseIcon size={18} />;
                section = resume.experienceSection;
                addHandler = handleAddExperience;
                sectionTitle = section.sectionTitle;
                hidden = section.hidden;
                handleItemDragEnd = (event: DragEndEvent) => handleDragEnd('experienceSection', event);
                break;
              case 'skillSection':
                icon = <WrenchIcon size={18} />;
                section = resume.skillSection;
                addHandler = handleAddSkill;
                sectionTitle = section.sectionTitle;
                hidden = section.hidden;
                handleItemDragEnd = (event: DragEndEvent) => handleDragEnd('skillSection', event);
                break;
              case 'projectSection':
                icon = <CodeIcon size={18} />;
                section = resume.projectSection;
                addHandler = handleAddProject;
                sectionTitle = section.sectionTitle;
                hidden = section.hidden;
                handleItemDragEnd = (event: DragEndEvent) => handleDragEnd('projectSection', event);
                break;
              default:
                return null;
            }
            return (
              <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <EditorAccordion
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {icon}
                          <EditableField
                            value={sectionTitle}
                            onChange={(value) => updateSectionTitle(sectionKey, value)}
                            className="!p-0 hover:bg-transparent"
                          />
                          <span className="ml-2 flex items-center cursor-grab text-gray-400 hover:bg-gray-100 rounded-full p-1 transition" title="Drag to reorder section">
                            <ArrowUpDownIcon size={20} />
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionVisibility(sectionKey);
                            }}
                            className="p-1 rounded hover:bg-gray-100"
                            title={hidden ? 'Show section' : 'Hide section'}
                          >
                            {hidden ? (
                              <EyeOffIcon size={16} className="text-gray-500" />
                            ) : (
                              <EyeIcon size={16} className="text-blue-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    }
                    isExpanded={expandedSections.includes(sectionKey)}
                    onToggle={() => toggleSection(sectionKey)}
                    isCustomTitle
                  >
                    {/* DnD for items inside section */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
                      <SortableContext items={section.items.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {section.items.map((item) => (
                            <DraggableItem key={item.id} id={String(item.id)} className="border rounded-md p-3 bg-white">
                              <SectionItemEditor sectionKey={sectionKey} item={item} />
                            </DraggableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <button
                      onClick={addHandler}
                      className="mt-4 w-full btn btn-secondary"
                    >
                      <PlusIcon size={16} />
                      Add {sectionKey.replace('Section', '')[0].toUpperCase() + sectionKey.replace('Section', '').slice(1)}
                    </button>
                  </EditorAccordion>
                </div>
              </DraggableItem>
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default EditorSidebar; 
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
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { Resume } from '../types';
import useResumeStore from '../store/resumeStore';
import EditableField from './ui/EditableField';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './ui/DraggableItem';
import EditorAccordion from './EditorAccordion';
import SectionItemEditor from './SectionItemEditor';
import WorkExperienceSection from './WorkExperienceSection';
import EducationSection from './EducationSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import PersonalDetailsSection from './PersonalDetailsSection';
import ProfessionalSummarySection from './ProfessionalSummarySection';

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

  const sectionKeys = ['educationSection', 'experienceSection', 'skillSection', 'projectSection'] as const;
  type SectionKey = typeof sectionKeys[number];
  type AllSectionId = SectionKey | 'personalDetails' | 'summary';
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

  const toggleSection = (sectionId: AllSectionId) => {
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

  const getSectionItemsById = (sectionKey: SectionKey) => {
    switch (sectionKey) {
      case 'educationSection':
        return resume.educationSection.items;
      case 'experienceSection':
        return resume.experienceSection.items;
      case 'projectSection':
        return resume.projectSection.items;
      case 'skillSection':
        return resume.skillSection.items;
      default:
        return [];
    }
  };

  const handleDragEnd = (sectionKey: SectionKey, event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const items = getSectionItemsById(sectionKey);
    const activeIndex = items.findIndex((item: { id: number }) => item.id === Number(active.id));
    const overIndex = items.findIndex((item: { id: number }) => item.id === Number(over.id));

    if (activeIndex !== -1 && overIndex !== -1) {
      const newOrder = arrayMove(items as any, activeIndex, overIndex);
      reorderItems(sectionKey, newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
      <div className="space-y-6 w-full">
        {/* Personal Details */}
        <PersonalDetailsSection
          personalDetails={resume.personalDetails}
          sectionTitle="Personal Details"
          hidden={resume.personalDetails.hidden || false}
        />
        {/* Summary */}
        <ProfessionalSummarySection
          summary={resume.summary}
          sectionTitle="Professional Summary"
          hidden={resume.summaryHidden || false}
        />
        {/* Main Sections: Draggable as cards */}
        <SortableContext items={orderedSectionKeys} strategy={verticalListSortingStrategy}>
          {orderedSectionKeys.map((sectionKey) => {
            // Handle experience section separately with new component
            if (sectionKey === 'experienceSection') {
              return (
                <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                  <WorkExperienceSection
                    experiences={resume.experienceSection.items}
                    sectionTitle={resume.experienceSection.sectionTitle}
                    hidden={resume.experienceSection.hidden}
                  />
                </DraggableItem>
              );
            }
            if (sectionKey === 'educationSection') {
              return (
                <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                  <EducationSection
                    education={resume.educationSection.items}
                    sectionTitle={resume.educationSection.sectionTitle}
                    hidden={resume.educationSection.hidden}
                  />
                </DraggableItem>
              );
            }
            if (sectionKey === 'projectSection') {
              return (
                <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                  <ProjectsSection
                    projects={resume.projectSection.items}
                    sectionTitle={resume.projectSection.sectionTitle}
                    hidden={resume.projectSection.hidden}
                  />
                </DraggableItem>
              );
            }
            let icon, section, addHandler, sectionTitle, hidden;
            let handleItemDragEnd;
            switch (sectionKey) {
              case 'skillSection':
                return (
                  <DraggableItem key={sectionKey} id={sectionKey}>
                    <SkillsSection
                      skills={resume.skillSection.items}
                      sectionTitle={resume.skillSection.sectionTitle}
                      hidden={resume.skillSection.hidden}
                    />
                  </DraggableItem>
                );
              default:
                return null;
            }
            return (
              <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                <div className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 ${
                  sectionKey === 'skillSection' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' :
                  'bg-white border-gray-100'
                }`}>
                  <EditorAccordion
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            sectionKey === 'skillSection' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {icon}
                          </div>
                          <EditableField
                            value={sectionTitle}
                            onChange={(value) => updateSectionTitle(sectionKey, value)}
                            className="!p-0 hover:bg-transparent font-semibold"
                          />
                          <span className="ml-2 flex items-center cursor-grab text-gray-400 hover:bg-white hover:text-gray-600 rounded-full p-2 transition-all duration-200 shadow-sm" title="Drag to reorder section">
                            <ArrowUpDownIcon size={16} />
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionVisibility(sectionKey);
                            }}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              hidden 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={hidden ? 'Show section' : 'Hide section'}
                          >
                            {hidden ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
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
                      <SortableContext items={section.items.map((item : any) => String(item.id))} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4 mt-4">
                          {section.items.map((item : any) => (
                            <DraggableItem key={item.id} id={String(item.id)} className="transition-all duration-200 hover:scale-[1.01]">
                              <SectionItemEditor sectionKey={sectionKey} item={item} />
                            </DraggableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <button
                      onClick={addHandler}
                      className={`mt-6 w-full py-3 px-4 rounded-lg border-2 border-dashed transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                        sectionKey === 'skillSection' ? 'border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400' :
                        'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <PlusIcon size={18} />
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
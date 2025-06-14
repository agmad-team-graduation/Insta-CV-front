import React from 'react';
import { Resume } from '../types';
import useResumeStore from '../store/resumeStore';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './ui/DraggableItem';
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
    reorderItems,
    reorderSections
  } = useResumeStore();

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
            if (sectionKey === 'skillSection') {
              return (
                <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                  <SkillsSection
                    skills={resume.skillSection.items}
                    sectionTitle={resume.skillSection.sectionTitle}
                    hidden={resume.skillSection.hidden}
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
            return null;
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default EditorSidebar; 
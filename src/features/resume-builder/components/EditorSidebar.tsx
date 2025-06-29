import React, { useState } from 'react';
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

  const sectionKeys = ['summarySection', 'educationSection', 'experienceSection', 'skillSection', 'projectSection'] as const;
  type SectionKey = typeof sectionKeys[number];

  // Get section order from resume.sectionsOrder or fallback to default order
  const orderedSectionKeys = [...sectionKeys].sort((a, b) => {
    const orderA = resume.sectionsOrder?.[a.replace('Section', '')] ?? 0;
    const orderB = resume.sectionsOrder?.[b.replace('Section', '')] ?? 0;
    return orderA - orderB;
  });

  const [expandedSection, setExpandedSection] = useState<string | null>('personalDetails');

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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
      <div className="space-y-6 w-full">
        {/* Personal Details */}
        <PersonalDetailsSection
          personalDetails={resume.personalDetails}
          sectionTitle="Personal Details"
          hidden={resume.personalDetails.hidden || false}
          isExpanded={expandedSection === 'personalDetails'}
          onToggle={() => setExpandedSection(expandedSection === 'personalDetails' ? null : 'personalDetails')}
        />
        {/* Main Sections: Draggable as cards */}
        <SortableContext items={orderedSectionKeys} strategy={verticalListSortingStrategy}>
          {orderedSectionKeys.map((sectionKey) => {
            if (sectionKey === 'summarySection') {
              return (
                <ProfessionalSummarySection
                  key={sectionKey}
                  summary={resume.summarySection.summary}
                  sectionTitle={resume.summarySection.sectionTitle}
                  hidden={resume.summarySection.hidden || false}
                  isExpanded={expandedSection === 'summarySection'}
                  onToggle={() => setExpandedSection(expandedSection === 'summarySection' ? null : 'summarySection')}
                />
              );
            }
            if (sectionKey === 'experienceSection') {
              return (
                <DraggableItem key={sectionKey} id={sectionKey} className="mb-2">
                  <WorkExperienceSection
                    experiences={resume.experienceSection.items}
                    sectionTitle={resume.experienceSection.sectionTitle}
                    hidden={resume.experienceSection.hidden}
                    isExpanded={expandedSection === 'experienceSection'}
                    onToggle={() => setExpandedSection(expandedSection === 'experienceSection' ? null : 'experienceSection')}
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
                    isExpanded={expandedSection === 'educationSection'}
                    onToggle={() => setExpandedSection(expandedSection === 'educationSection' ? null : 'educationSection')}
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
                    isExpanded={expandedSection === 'skillSection'}
                    onToggle={() => setExpandedSection(expandedSection === 'skillSection' ? null : 'skillSection')}
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
                    isExpanded={expandedSection === 'projectSection'}
                    onToggle={() => setExpandedSection(expandedSection === 'projectSection' ? null : 'projectSection')}
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
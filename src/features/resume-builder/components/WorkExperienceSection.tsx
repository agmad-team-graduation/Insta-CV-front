import React, { useState } from 'react';
import { 
  BriefcaseIcon, 
  PencilIcon, 
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  MapPinIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExperienceItem } from '../types';
import useResumeStore from '../store/resumeStore';
import SectionItemEditor from './SectionItemEditor';

interface WorkExperienceSectionProps {
  experiences: ExperienceItem[];
  sectionTitle: string;
  hidden: boolean;
}

interface GroupedExperience {
  jobTitle: string;
  entries: ExperienceItem[];
  isGrouped: boolean;
}

interface ExperienceCardProps {
  experience: GroupedExperience;
  onToggleVisibility: (id: number) => void;
  onEdit: (id: number) => void;
  isEditMode: boolean;
  onEditComplete: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  experience, 
  onToggleVisibility, 
  onEdit, 
  isEditMode,
  onEditComplete 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.entries[0].id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string, present: boolean) => {
    const start = formatDate(startDate);
    const end = present ? 'Present' : formatDate(endDate);
    return `${start} – ${end}`;
  };

  const parseDescription = (description: string): string[] => {
    if (!description) return [];
    // Split by bullet points, newlines, or numbered lists
    const bullets = description
      .split(/[•\n\r]|^\d+\.|\*/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .slice(0, 3); // Limit to 3 bullet points
    return bullets;
  };

  // If in edit mode, show the editor
  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="transition-all duration-200"
      >
        <SectionItemEditor 
          sectionKey="experienceSection" 
          item={experience.entries[0]} 
          onComplete={onEditComplete}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105' : ''
      }`}
    >
      <div className="p-6">
        {/* Header with drag handle and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder"
            >
              <GripVerticalIcon size={16} />
            </button>

            {/* Content */}
            <div 
              className="flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2"
              onClick={() => onEdit(experience.entries[0].id)}
            >
              {experience.isGrouped ? (
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {experience.jobTitle} <span className="text-sm font-normal text-gray-500">(multiple employers)</span>
                  </h3>
                  {experience.entries.map((entry, index) => (
                    <div key={entry.id} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 italic">{entry.company}</span>
                        <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wide">
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {formatDateRange(entry.startDate, entry.endDate, entry.present)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon size={12} />
                            {entry.city}, {entry.country}
                          </div>
                        </div>
                      </div>
                      {entry.description && (
                        <div className="ml-4">
                          {parseDescription(entry.description).map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="text-sm text-gray-600 mb-1 flex items-start">
                              <span className="text-gray-400 mr-2 mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                              <span className="font-medium text-gray-500 mr-2">{entry.company}:</span>
                              {bullet}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{experience.entries[0].jobTitle}</h3>
                    <span className="text-sm font-normal text-gray-600 italic">{experience.entries[0].company}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wide mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={12} />
                      {formatDateRange(experience.entries[0].startDate, experience.entries[0].endDate, experience.entries[0].present)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon size={12} />
                      {experience.entries[0].city}, {experience.entries[0].country}
                    </div>
                  </div>
                  {experience.entries[0].description && (
                    <div className="space-y-1">
                      {parseDescription(experience.entries[0].description).map((bullet, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-400 mr-2 mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                          {bullet}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(experience.entries[0].id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Edit experience"
            >
              <PencilIcon size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(experience.entries[0].id);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title={experience.entries[0].hidden ? 'Show item' : 'Hide item'}
            >
              {experience.entries[0].hidden ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ 
  experiences, 
  sectionTitle, 
  hidden 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { 
    addItem, 
    reorderItems, 
    toggleItemVisibility, 
    updateSectionTitle, 
    toggleSectionVisibility 
  } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Group experiences by job title
  const groupedExperiences: GroupedExperience[] = React.useMemo(() => {
    const groups: { [key: string]: ExperienceItem[] } = {};
    
    experiences.forEach(exp => {
      const key = exp.jobTitle.toLowerCase().trim();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(exp);
    });

    return Object.entries(groups).map(([jobTitle, entries]) => ({
      jobTitle: entries[0].jobTitle, // Use original casing
      entries: entries.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
      isGrouped: entries.length > 1
    }));
  }, [experiences]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const activeIndex = experiences.findIndex(exp => exp.id === active.id);
    const overIndex = experiences.findIndex(exp => exp.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newOrder = arrayMove(experiences, activeIndex, overIndex);
      reorderItems('experienceSection', newOrder);
    }
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

  const handleToggleVisibility = (id: number) => {
    toggleItemVisibility('experienceSection', id);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleEditComplete = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Bar */}
      <div className="border-b border-gray-100">
        <button
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <BriefcaseIcon size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility('experienceSection');
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                hidden 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              title={hidden ? 'Show section' : 'Hide section'}
            >
              {hidden ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
            <div className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-all duration-200">
              {isExpanded ? (
                <ChevronUpIcon size={18} className="text-gray-600" />
              ) : (
                <ChevronDownIcon size={18} className="text-gray-600" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          {experiences.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={experiences.map(exp => exp.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {groupedExperiences.map((group) => (
                    <ExperienceCard
                      key={group.entries[0].id}
                      experience={group}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={handleEdit}
                      isEditMode={editingId === group.entries[0].id}
                      onEditComplete={handleEditComplete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BriefcaseIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No work experience added yet</p>
              <p className="text-sm">Add your first work experience to get started</p>
            </div>
          )}

          {/* Add Experience Button */}
          <button
            onClick={handleAddExperience}
            className="mt-6 w-full py-3 px-4 border-2 border-dashed border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <PlusIcon size={18} />
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceSection; 
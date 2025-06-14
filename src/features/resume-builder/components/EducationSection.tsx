import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  PlusIcon,
  EyeOffIcon,
  EyeIcon,
  PencilIcon,
  GripVerticalIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { EducationEntry } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import useResumeStore from '../store/resumeStore';
import SectionItemEditor from './SectionItemEditor';
import EditableField from './ui/EditableField';

interface EducationSectionProps {
  education: EducationEntry[];
  sectionTitle: string;
  hidden: boolean;
  onUpdate?: (id: number, data: Partial<EducationEntry>) => void;
  onAdd?: (data: EducationEntry) => void;
  onDelete?: (id: number) => void;
  onToggleVisibility?: (id: number) => void;
  onReorder?: (items: EducationEntry[]) => void;
  isEditMode?: boolean;
  onEditComplete?: () => void;
  onToggleSection?: () => void;
}

interface EducationCardProps {
  education: EducationEntry;
  onToggleVisibility: (id: number) => void;
  onEdit: (id: number) => void;
  isEditMode: boolean;
  onEditComplete: () => void;
}

const EducationCard: React.FC<EducationCardProps> = ({ 
  education, 
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
  } = useSortable({ id: education.id });

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
          sectionKey="educationSection" 
          item={education} 
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
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Drag Handle */}
          <div className="flex items-start gap-4 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder"
            >
              <GripVerticalIcon size={20} />
            </button>

            {/* Content */}
            <div
              className="flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2"
              onClick={() => onEdit(education.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{education.degree}</h3>
                  <span className="text-sm font-normal text-gray-600 italic">{education.school}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wide mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {formatDateRange(education.startDate, education.endDate, education.present)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon size={12} />
                    {education.city}, {education.country}
                  </div>
                </div>
                {education.description && (
                  <div className="space-y-1">
                    {parseDescription(education.description).map((bullet, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {bullet}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(education.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Edit education"
            >
              <PencilIcon size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(education.id);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title={education.hidden ? 'Show item' : 'Hide item'}
            >
              {education.hidden ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  sectionTitle,
  hidden,
  onUpdate,
  onAdd,
  onDelete,
  onToggleVisibility,
  onReorder,
  isEditMode,
  onEditComplete,
  onToggleSection
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { 
    addItem, 
    reorderItems, 
    toggleItemVisibility, 
    updateSectionTitle, 
    toggleSectionVisibility 
  } = useResumeStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: 'educationSection' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const activeIndex = education.findIndex(edu => edu.id === active.id);
    const overIndex = education.findIndex(edu => edu.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newOrder = arrayMove(education, activeIndex, overIndex);
      reorderItems('educationSection', newOrder);
    }
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
      present: false,
      hidden: false
    });
  };

  const handleToggleVisibility = (id: number) => {
    toggleItemVisibility('educationSection', id);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleEditComplete = () => {
    setEditingId(null);
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="border-b border-gray-100">
        <button
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <BookOpenIcon size={20} className="text-gray-600" />
            <EditableField
              value={sectionTitle}
              onChange={(value) => updateSectionTitle('educationSection', value)}
              className="!p-0 hover:bg-transparent font-semibold text-lg text-gray-900"
              onEditStart={() => setIsEditingTitle(true)}
              onEditEnd={() => setIsEditingTitle(false)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder section"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVerticalIcon size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility('educationSection');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
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
          {/* Rest of the content */}
          <div className="space-y-4">
            {education.map((edu) => (
              <EducationCard
                key={edu.id}
                education={edu}
                onToggleVisibility={() => toggleItemVisibility('educationSection', edu.id)}
                onEdit={() => setEditingId(edu.id)}
                isEditMode={editingId === edu.id}
                onEditComplete={() => setEditingId(null)}
              />
            ))}
          </div>
          <button
            onClick={() => addItem('educationSection', {
              degree: '',
              school: '',
              city: '',
              country: '',
              startDate: '',
              endDate: '',
              description: '',
              present: false
            })}
            className="mt-4 w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <PlusIcon size={16} />
            Add Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationSection; 
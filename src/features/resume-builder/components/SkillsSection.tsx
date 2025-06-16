import React, { useState } from 'react';
import { 
  WrenchIcon, 
  PencilIcon, 
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkillItem } from '../types/index';
import useResumeStore from '../store/resumeStore';
import SectionItemEditor from './SectionItemEditor';
import EditableField from './ui/EditableField';

interface SkillsSectionProps {
  skills: SkillItem[];
  sectionTitle: string;
  hidden: boolean;
}

interface SkillCardProps {
  skill: SkillItem;
  onToggleVisibility: (id: number) => void;
  onEdit: (id: number) => void;
  isEditMode: boolean;
  onEditComplete: () => void;
}

const getLevelColor = (level: string) => {
  if (!level) return '';
  
  switch (level) {
    case 'BEGINNER':
      return 'bg-amber-100';
    case 'INTERMEDIATE':
      return 'bg-green-100';
    case 'PROFICIENT':
      return 'bg-blue-100';
    case 'EXPERT':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

const SkillCard: React.FC<SkillCardProps> = ({ 
  skill, 
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
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
          sectionKey="skillSection" 
          item={skill} 
          onComplete={onEditComplete}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105' : ''
      }`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder"
          >
            <GripVerticalIcon size={14} />
          </button>

          {/* Content */}
          <div
            className="flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2"
            onClick={() => onEdit(skill.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{skill.skill}</h3>
              {skill.level && (
                <div className={`w-3 h-3 rounded-full ${getLevelColor(skill.level)}`} title={skill.level.charAt(0) + skill.level.slice(1).toLowerCase()} />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(skill.id)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Edit skill"
            >
              <PencilIcon size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(skill.id);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title={skill.hidden ? 'Show item' : 'Hide item'}
            >
              {skill.hidden ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  skills, 
  sectionTitle, 
  hidden 
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
  } = useSortable({ id: 'skillSection' });

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

    const activeIndex = skills.findIndex(skill => skill.id === active.id);
    const overIndex = skills.findIndex(skill => skill.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newOrder = arrayMove(skills, activeIndex, overIndex);
      reorderItems('skillSection', newOrder);
    }
  };

  const handleAddSkill = () => {
    addItem('skillSection', {
      skill: 'New Skill',
      level: 'INTERMEDIATE'
    });
  };

  const handleToggleVisibility = (id: number) => {
    toggleItemVisibility('skillSection', id);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleEditComplete = () => {
    setEditingId(null);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        <div
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3" onClick={handleTitleClick}>
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <WrenchIcon size={18} />
            </div>
            <EditableField
              value={sectionTitle}
              onChange={(value) => updateSectionTitle('skillSection', value)}
              className="!p-0 hover:bg-transparent font-semibold text-lg text-gray-900"
              onEditStart={() => setIsEditingTitle(true)}
              onEditEnd={() => setIsEditingTitle(false)}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Skill Level Guide */}
            {isExpanded && (
              <div className="hidden md:flex items-center gap-3 mr-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-100" title="Beginner"></div>
                  <span>Beginner</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-100" title="Intermediate"></div>
                  <span>Intermediate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-100" title="Proficient"></div>
                  <span>Proficient</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-100" title="Expert"></div>
                  <span>Expert</span>
                </div>
              </div>
            )}
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
                toggleSectionVisibility('skillSection');
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
        </div>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          {skills.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={skills.map(skill => skill.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={handleEdit}
                      isEditMode={editingId === skill.id}
                      onEditComplete={handleEditComplete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <WrenchIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No skills added yet</p>
              <p className="text-sm">Add your first skill to get started</p>
            </div>
          )}

          {/* Add Skill Button */}
          <button
            onClick={handleAddSkill}
            className="mt-6 w-full py-3 px-4 border-2 border-dashed border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <PlusIcon size={18} />
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection; 
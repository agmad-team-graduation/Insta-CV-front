import React, { useState, useEffect } from 'react';
import { 
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  XIcon
} from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import EditableField from './ui/EditableField';
import { formatDateRange } from '../utils/formatters';
import { EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../types';

type SectionKey = 'educationSection' | 'experienceSection' | 'projectSection' | 'skillSection';

interface SectionItemEditorProps {
  sectionKey: SectionKey;
  item: EducationItem | ExperienceItem | ProjectItem | SkillItem;
  onComplete?: () => void;
}

const SectionItemEditor: React.FC<SectionItemEditorProps> = ({ sectionKey, item, onComplete }) => {
  const { updateItem, deleteItem } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [editedItem, setEditedItem] = useState(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleUpdate = <T extends object>(field: keyof T, value: any) => {
    updateItem(sectionKey, item.id, { [field]: value });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (confirmDelete) {
      deleteItem(sectionKey, item.id);
      onComplete?.();
    }
  };

  const handlePresentToggle = () => {
    if ('present' in item) {
      const updatedPresent = !item.present;
      
      // If toggling to "present", set endDate to current date
      if (updatedPresent) {
        updateItem(sectionKey, item.id, { 
          present: updatedPresent,
          endDate: ''
        });
      } else {
        // If toggling off "present", set endDate to today
        const today = new Date().toISOString().split('T')[0];
        updateItem(sectionKey, item.id, { 
          present: updatedPresent,
          endDate: today
        });
      }
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const projectItem = item as ProjectItem;
    if (!projectItem.skills) return;
    
    const maxId = Math.max(0, ...projectItem.skills.map(s => s.id));
    const newSkillObj = { id: maxId + 1, skill: newSkill };
    
    updateItem<ProjectItem>(
      'projectSection', 
      item.id, 
      { skills: [...projectItem.skills, newSkillObj] }
    );
    
    setNewSkill('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillId: number) => {
    const projectItem = item as ProjectItem;
    if (!projectItem.skills) return;
    
    const updatedSkills = projectItem.skills.filter(s => s.id !== skillId);
    updateItem<ProjectItem>('projectSection', item.id, { skills: updatedSkills });
  };

  const handleSave = () => {
    if (updateItem) {
      updateItem(sectionKey, editedItem.id, editedItem);
      setIsEditing(false);
      onComplete();
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
    onComplete();
  };

  const renderEducationEditor = () => {
    const educationItem = item as EducationItem;
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">{educationItem.degree || 'New Education'}</h3>
          </div>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
            title="Delete education"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <EditableField
            value={educationItem.degree}
            onChange={(value) => handleUpdate<EducationItem>('degree', value)}
            label="Degree"
            placeholder="e.g., Bachelor of Science in Computer Science"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              value={educationItem.school}
              onChange={(value) => handleUpdate<EducationItem>('school', value)}
              label="School/University"
              placeholder="e.g., Harvard University"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <EditableField
                value={educationItem.city}
                onChange={(value) => handleUpdate<EducationItem>('city', value)}
                label="City"
                placeholder="e.g., Boston"
              />
              <EditableField
                value={educationItem.country}
                onChange={(value) => handleUpdate<EducationItem>('country', value)}
                label="Country"
                placeholder="e.g., USA"
              />
            </div>
          </div>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <EditableField
                value={educationItem.startDate}
                onChange={(value) => handleUpdate<EducationItem>('startDate', value)}
                type="date"
                label="Start Date"
              />
            </div>
            <div className="flex-1">
              {!educationItem.present && (
                <EditableField
                  value={educationItem.endDate}
                  onChange={(value) => handleUpdate<EducationItem>('endDate', value)}
                  type="date"
                  label="End Date"
                />
              )}
            </div>
            <div>
              <button
                onClick={handlePresentToggle}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  educationItem.present 
                    ? 'bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-offset-1 ring-blue-300' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                title={educationItem.present ? 'Currently studying (click to end)' : 'Mark as current'}
              >
                {educationItem.present ? 'Current' : 'Completed'}
              </button>
            </div>
          </div>
          
          <EditableField
            value={educationItem.description}
            onChange={(value) => handleUpdate<EducationItem>('description', value)}
            multiline
            label="Description"
            placeholder="Describe your achievements, relevant coursework, or other details..."
          />
        </div>
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const experienceItem = editedItem as ExperienceItem;
    return (
      <div className="rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">{experienceItem.jobTitle || 'New Experience'}</h3>
          </div>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
            title="Delete experience"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <EditableField
            value={experienceItem.jobTitle}
            onChange={(value) => handleUpdate<ExperienceItem>('jobTitle', value)}
            label="Job Title"
            placeholder="e.g., Senior Software Engineer"
            isEditing={isEditing}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              value={experienceItem.company}
              onChange={(value) => handleUpdate<ExperienceItem>('company', value)}
              label="Company"
              placeholder="e.g., Google Inc."
              isEditing={isEditing}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <EditableField
                value={experienceItem.city}
                onChange={(value) => handleUpdate<ExperienceItem>('city', value)}
                label="City"
                placeholder="e.g., San Francisco"
                isEditing={isEditing}
              />
              <EditableField
                value={experienceItem.country}
                onChange={(value) => handleUpdate<ExperienceItem>('country', value)}
                label="Country"
                placeholder="e.g., USA"
                isEditing={isEditing}
              />
            </div>
          </div>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <EditableField
                value={experienceItem.startDate}
                onChange={(value) => handleUpdate<ExperienceItem>('startDate', value)}
                type="date"
                label="Start Date"
                isEditing={isEditing}
              />
            </div>
            <div className="flex-1">
              {!experienceItem.present && (
                <EditableField
                  value={experienceItem.endDate}
                  onChange={(value) => handleUpdate<ExperienceItem>('endDate', value)}
                  type="date"
                  label="End Date"
                  isEditing={isEditing}
                />
              )}
            </div>
            <div>
              <button
                onClick={handlePresentToggle}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  experienceItem.present 
                    ? 'bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-offset-1 ring-blue-300' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                title={experienceItem.present ? 'Currently working (click to end)' : 'Mark as current'}
              >
                {experienceItem.present ? 'Current' : 'Past'}
              </button>
            </div>
          </div>
          
          <EditableField
            value={experienceItem.description}
            onChange={(value) => handleUpdate<ExperienceItem>('description', value)}
            multiline
            label="Description"
            placeholder="Describe your responsibilities, achievements, and impact..."
            isEditing={isEditing}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectEditor = () => {
    const projectItem = item as ProjectItem;
    return (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">{projectItem.title || 'New Project'}</h3>
          </div>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
            title="Delete project"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <EditableField
            value={projectItem.title}
            onChange={(value) => handleUpdate<ProjectItem>('title', value)}
            label="Project Title"
            placeholder="e.g., E-commerce Mobile App"
          />
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <EditableField
                value={projectItem.startDate}
                onChange={(value) => handleUpdate<ProjectItem>('startDate', value)}
                type="date"
                label="Start Date"
              />
            </div>
            <div className="flex-1">
              {!projectItem.present && (
                <EditableField
                  value={projectItem.endDate}
                  onChange={(value) => handleUpdate<ProjectItem>('endDate', value)}
                  type="date"
                  label="End Date"
                />
              )}
            </div>
            <div>
              <button
                onClick={handlePresentToggle}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  projectItem.present 
                    ? 'bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-offset-1 ring-blue-300' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                title={projectItem.present ? 'Currently working (click to end)' : 'Mark as current'}
              >
                {projectItem.present ? 'Ongoing' : 'Completed'}
              </button>
            </div>
          </div>
          
          <EditableField
            value={projectItem.description}
            onChange={(value) => handleUpdate<ProjectItem>('description', value)}
            multiline
            label="Description"
            placeholder="Describe the project, your role, technologies used, and outcomes..."
          />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Project Skills</label>
              {!showAddSkill && (
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  <PlusIcon size={14} />
                  Add Skill
                </button>
              )}
            </div>
            
            {showAddSkill && (
              <div className="flex gap-2 p-3 bg-white rounded-lg border border-orange-200">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter skill (e.g., React, Node.js)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill();
                    } else if (e.key === 'Escape') {
                      setShowAddSkill(false);
                      setNewSkill('');
                    }
                  }}
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddSkill(false);
                    setNewSkill('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {projectItem.skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-200 rounded-full text-sm font-medium text-orange-700 hover:bg-orange-50 transition-all duration-200"
                >
                  <span>{skill.skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-orange-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkillEditor = () => {
    const skillItem = item as SkillItem;
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">{skillItem.skill || 'New Skill'}</h3>
          </div>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
            title="Delete skill"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <EditableField
            value={skillItem.skill}
            onChange={(value) => handleUpdate<SkillItem>('skill', value)}
            label="Skill Name"
            placeholder="e.g., JavaScript, Python, Design..."
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Proficiency Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'BEGINNER', label: 'Beginner', color: 'bg-red-100 text-red-700 border-red-200' },
                { value: 'INTERMEDIATE', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { value: 'ADVANCED', label: 'Advanced', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { value: 'EXPERT', label: 'Expert', color: 'bg-green-100 text-green-700 border-green-200' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleUpdate<SkillItem>('level', level.value)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    skillItem.level === level.value
                      ? level.color + ' ring-2 ring-offset-1 ring-blue-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (sectionKey) {
    case 'educationSection':
      return renderEducationEditor();
    case 'experienceSection':
      return renderExperienceEditor();
    case 'projectSection':
      return renderProjectEditor();
    case 'skillSection':
      return renderSkillEditor();
    default:
      return null;
  }
};

export default SectionItemEditor; 
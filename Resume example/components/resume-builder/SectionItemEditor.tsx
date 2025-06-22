import React, { useState } from 'react';
import { 
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  XIcon
} from 'lucide-react';
import useResumeStore from '../../store/resumeStore';
import EditableField from '../ui/EditableField';
import { formatDateRange } from '../../utils/formatters';
import { EducationItem, ExperienceItem, ProjectItem, SkillItem } from '../../types';

type SectionKey = 'educationSection' | 'experienceSection' | 'projectSection' | 'skillSection';

interface SectionItemEditorProps {
  sectionKey: SectionKey;
  item: any;
}

const SectionItemEditor: React.FC<SectionItemEditorProps> = ({ sectionKey, item }) => {
  const { updateItem, deleteItem } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleUpdate = <T extends object>(field: keyof T, value: any) => {
    updateItem(sectionKey, item.id, { [field]: value });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (confirmDelete) {
      deleteItem(sectionKey, item.id);
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

  const renderEducationEditor = () => {
    const educationItem = item as EducationItem;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{educationItem.degree || 'New Education'}</h3>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
            title="Delete education"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <EditableField
          value={educationItem.degree}
          onChange={(value) => handleUpdate<EducationItem>('degree', value)}
          label="Degree/Certificate"
        />
        
        <EditableField
          value={educationItem.school}
          onChange={(value) => handleUpdate<EducationItem>('school', value)}
          label="School/University"
        />
        
        <div className="flex gap-3">
          <div className="flex-1">
            <EditableField
              value={educationItem.city}
              onChange={(value) => handleUpdate<EducationItem>('city', value)}
              label="City"
            />
          </div>
          <div className="flex-1">
            <EditableField
              value={educationItem.country}
              onChange={(value) => handleUpdate<EducationItem>('country', value)}
              label="Country"
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
              className={`px-3 py-2 border rounded ${
                educationItem.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
              title={educationItem.present ? 'Current (click to end)' : 'Mark as current'}
            >
              {educationItem.present ? 'Current' : 'Not Current'}
            </button>
          </div>
        </div>
        
        <EditableField
          value={educationItem.description}
          onChange={(value) => handleUpdate<EducationItem>('description', value)}
          multiline
          label="Description"
        />
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const experienceItem = item as ExperienceItem;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{experienceItem.jobTitle || 'New Position'}</h3>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
            title="Delete experience"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <EditableField
          value={experienceItem.jobTitle}
          onChange={(value) => handleUpdate<ExperienceItem>('jobTitle', value)}
          label="Job Title"
        />
        
        <EditableField
          value={experienceItem.company}
          onChange={(value) => handleUpdate<ExperienceItem>('company', value)}
          label="Company"
        />
        
        <div className="flex gap-3">
          <div className="flex-1">
            <EditableField
              value={experienceItem.city}
              onChange={(value) => handleUpdate<ExperienceItem>('city', value)}
              label="City"
            />
          </div>
          <div className="flex-1">
            <EditableField
              value={experienceItem.country}
              onChange={(value) => handleUpdate<ExperienceItem>('country', value)}
              label="Country"
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
            />
          </div>
          <div className="flex-1">
            {!experienceItem.present && (
              <EditableField
                value={experienceItem.endDate}
                onChange={(value) => handleUpdate<ExperienceItem>('endDate', value)}
                type="date"
                label="End Date"
              />
            )}
          </div>
          <div>
            <button
              onClick={handlePresentToggle}
              className={`px-3 py-2 border rounded ${
                experienceItem.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
              title={experienceItem.present ? 'Current (click to end)' : 'Mark as current'}
            >
              {experienceItem.present ? 'Current' : 'Not Current'}
            </button>
          </div>
        </div>
        
        <EditableField
          value={experienceItem.description}
          onChange={(value) => handleUpdate<ExperienceItem>('description', value)}
          multiline
          label="Description"
        />
      </div>
    );
  };

  const renderProjectEditor = () => {
    const projectItem = item as ProjectItem;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{projectItem.title || 'New Project'}</h3>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
            title="Delete project"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <EditableField
          value={projectItem.title}
          onChange={(value) => handleUpdate<ProjectItem>('title', value)}
          label="Project Title"
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
              className={`px-3 py-2 border rounded ${
                projectItem.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
              title={projectItem.present ? 'Current (click to end)' : 'Mark as current'}
            >
              {projectItem.present ? 'Current' : 'Not Current'}
            </button>
          </div>
        </div>
        
        <EditableField
          value={projectItem.description}
          onChange={(value) => handleUpdate<ProjectItem>('description', value)}
          multiline
          label="Description"
        />
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {projectItem.skills?.map((skill) => (
              <div key={skill.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                {skill.skill}
                <button 
                  onClick={() => handleRemoveSkill(skill.id)} 
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ))}
          </div>
          
          {showAddSkill ? (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="border rounded-l px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter skill name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill();
                  } else if (e.key === 'Escape') {
                    setShowAddSkill(false);
                    setNewSkill('');
                  }
                }}
                autoFocus
              />
              <button 
                onClick={handleAddSkill}
                className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
              >
                Add
              </button>
              <button 
                onClick={() => {
                  setShowAddSkill(false);
                  setNewSkill('');
                }}
                className="ml-2 bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSkill(true)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusIcon size={16} className="mr-1" /> Add Skill
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSkillEditor = () => {
    const skillItem = item as SkillItem;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{skillItem.skill || 'New Skill'}</h3>
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
            title="Delete skill"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        
        <EditableField
          value={skillItem.skill}
          onChange={(value) => handleUpdate<SkillItem>('skill', value)}
          label="Skill Name"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
          <div className="grid grid-cols-2 gap-2">
            {['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'EXPERT'].map((level) => (
              <button
                key={level}
                onClick={() => handleUpdate<SkillItem>('level', level)}
                className={`py-2 px-3 border rounded transition-colors ${
                  skillItem.level === level 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate editor based on section type
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
      return <div>Unknown section type</div>;
  }
};

export default SectionItemEditor;
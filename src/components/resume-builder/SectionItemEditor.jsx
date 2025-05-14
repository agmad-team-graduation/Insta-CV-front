import React, { useState } from 'react';
import { 
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  XIcon
} from 'lucide-react';
import useResumeStore from '../../store/resumeStore';
import EditableField from '../ui/EditableField';

const SectionItemEditor = ({ sectionKey, item }) => {
  const { updateItem, deleteItem } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleUpdate = (field, value) => {
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
      if (updatedPresent) {
        updateItem(sectionKey, item.id, { 
          present: updatedPresent,
          endDate: ''
        });
      } else {
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
    if (!item.skills) return;

    const maxId = Math.max(0, ...item.skills.map(s => s.id));
    const newSkillObj = { id: maxId + 1, skill: newSkill };

    updateItem('projectSection', item.id, { skills: [...item.skills, newSkillObj] });

    setNewSkill('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillId) => {
    if (!item.skills) return;

    const updatedSkills = item.skills.filter(s => s.id !== skillId);
    updateItem('projectSection', item.id, { skills: updatedSkills });
  };

  const renderEducationEditor = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{item.degree || 'New Education'}</h3>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete education"
        >
          <Trash2Icon size={16} />
        </button>
      </div>

      <EditableField
        value={item.degree}
        onChange={(value) => handleUpdate('degree', value)}
        label="Degree/Certificate"
      />
      <EditableField
        value={item.school}
        onChange={(value) => handleUpdate('school', value)}
        label="School/University"
      />

      <div className="flex gap-3">
        <EditableField
          value={item.city}
          onChange={(value) => handleUpdate('city', value)}
          label="City"
        />
        <EditableField
          value={item.country}
          onChange={(value) => handleUpdate('country', value)}
          label="Country"
        />
      </div>

      <div className="flex gap-3 items-end">
        <EditableField
          value={item.startDate}
          onChange={(value) => handleUpdate('startDate', value)}
          type="date"
          label="Start Date"
        />
        {!item.present && (
          <EditableField
            value={item.endDate}
            onChange={(value) => handleUpdate('endDate', value)}
            type="date"
            label="End Date"
          />
        )}
        <button
          onClick={handlePresentToggle}
          className={`px-3 py-2 border rounded ${
            item.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
          }`}
        >
          {item.present ? 'Current' : 'Not Current'}
        </button>
      </div>

      <EditableField
        value={item.description}
        onChange={(value) => handleUpdate('description', value)}
        multiline
        label="Description"
      />
    </div>
  );

  const renderExperienceEditor = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{item.jobTitle || 'New Position'}</h3>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete experience"
        >
          <Trash2Icon size={16} />
        </button>
      </div>

      <EditableField
        value={item.jobTitle}
        onChange={(value) => handleUpdate('jobTitle', value)}
        label="Job Title"
      />
      <EditableField
        value={item.company}
        onChange={(value) => handleUpdate('company', value)}
        label="Company"
      />

      <div className="flex gap-3">
        <EditableField
          value={item.city}
          onChange={(value) => handleUpdate('city', value)}
          label="City"
        />
        <EditableField
          value={item.country}
          onChange={(value) => handleUpdate('country', value)}
          label="Country"
        />
      </div>

      <div className="flex gap-3 items-end">
        <EditableField
          value={item.startDate}
          onChange={(value) => handleUpdate('startDate', value)}
          type="date"
          label="Start Date"
        />
        {!item.present && (
          <EditableField
            value={item.endDate}
            onChange={(value) => handleUpdate('endDate', value)}
            type="date"
            label="End Date"
          />
        )}
        <button
          onClick={handlePresentToggle}
          className={`px-3 py-2 border rounded ${
            item.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
          }`}
        >
          {item.present ? 'Current' : 'Not Current'}
        </button>
      </div>

      <EditableField
        value={item.description}
        onChange={(value) => handleUpdate('description', value)}
        multiline
        label="Description"
      />
    </div>
  );

  const renderProjectEditor = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{item.title || 'New Project'}</h3>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete project"
        >
          <Trash2Icon size={16} />
        </button>
      </div>

      <EditableField
        value={item.title}
        onChange={(value) => handleUpdate('title', value)}
        label="Project Title"
      />

      <div className="flex gap-3 items-end">
        <EditableField
          value={item.startDate}
          onChange={(value) => handleUpdate('startDate', value)}
          type="date"
          label="Start Date"
        />
        {!item.present && (
          <EditableField
            value={item.endDate}
            onChange={(value) => handleUpdate('endDate', value)}
            type="date"
            label="End Date"
          />
        )}
        <button
          onClick={handlePresentToggle}
          className={`px-3 py-2 border rounded ${
            item.present ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
          }`}
        >
          {item.present ? 'Current' : 'Not Current'}
        </button>
      </div>

      <EditableField
        value={item.description}
        onChange={(value) => handleUpdate('description', value)}
        multiline
        label="Description"
      />

      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {item.skills?.map((skill) => (
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

  const renderSkillEditor = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{item.skill || 'New Skill'}</h3>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete skill"
        >
          <Trash2Icon size={16} />
        </button>
      </div>

      <EditableField
        value={item.skill}
        onChange={(value) => handleUpdate('skill', value)}
        label="Skill Name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
        <div className="grid grid-cols-2 gap-2">
          {['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'EXPERT'].map((level) => (
            <button
              key={level}
              onClick={() => handleUpdate('level', level)}
              className={`py-2 px-3 border rounded transition-colors ${
                item.level === level 
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

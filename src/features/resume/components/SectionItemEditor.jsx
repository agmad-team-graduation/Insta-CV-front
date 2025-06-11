import React, { useState } from 'react';
import { 
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon
} from 'lucide-react';
import EditableField from '../ui/EditableField';
import { formatDateRange } from '../../utils/formatters';

const SectionItemEditor = ({ 
  section, 
  sectionKey, 
  onUpdateTitle, 
  onToggleVisibility, 
  onReorderItems, 
  onAddItem, 
  onDeleteItem,
  itemFields 
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const toggleItemExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderItemEditor = (item) => {
    const isExpanded = expandedItems[item.id] !== false; // Default to expanded

    return (
      <div key={item.id} className="border border-gray-200 rounded-md mb-3 overflow-hidden">
        <div 
          className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
          onClick={() => toggleItemExpanded(item.id)}
        >
          <h3 className="font-medium text-gray-800">
            {sectionKey === 'educationSection' && (item.degree || 'New Education')}
            {sectionKey === 'experienceSection' && (item.jobTitle || 'New Position')}
            {sectionKey === 'projectSection' && (item.title || 'New Project')}
            {sectionKey === 'skillSection' && (item.skill || 'New Skill')}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(item.id);
              }}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
              title="Delete item"
            >
              <Trash2Icon size={16} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3 border-t border-gray-200 space-y-3">
            {itemFields.map((field) => {
              // Skip rendering if conditional display is defined and returns false
              if (field.conditionalDisplay && !field.conditionalDisplay(item)) {
                return null;
              }

              if (field.type === 'checkbox') {
                return (
                  <div key={field.name} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${item.id}-${field.name}`}
                      checked={item[field.name] || false}
                      onChange={(e) => {
                        const updates = { [field.name]: e.target.checked };
                        
                        // If toggling present status, handle endDate
                        if (field.name === 'present' && e.target.checked) {
                          updates.endDate = '';
                        } else if (field.name === 'present' && !e.target.checked) {
                          updates.endDate = new Date().toISOString().split('T')[0];
                        }
                        
                        // Use the updateItem function from the store
                        // This would need to be passed down or accessed via context
                      }}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`${item.id}-${field.name}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <select
                      value={item[field.name] || ''}
                      onChange={(e) => {
                        // Update item
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <textarea
                      value={item[field.name] || ''}
                      onChange={(e) => {
                        // Update item
                      }}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                );
              }

              // Default to text input
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={item[field.name] || ''}
                    onChange={(e) => {
                      // Update item
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              );
            })}

            {/* Special handling for project skills */}
            {sectionKey === 'projectSection' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.skills?.map((skill) => (
                    <div key={skill.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                      {skill.skill}
                      <button 
                        onClick={() => {
                          // Remove skill
                        }} 
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
                          // Add skill
                        } else if (e.key === 'Escape') {
                          setShowAddSkill(false);
                          setNewSkill('');
                        }
                      }}
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        // Add skill
                      }}
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
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <EditableField
          value={section.sectionTitle}
          onChange={onUpdateTitle}
          className="font-medium text-lg"
        />
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded hover:bg-gray-100"
          title={section.hidden ? 'Show section' : 'Hide section'}
        >
          {section.hidden ? (
            <EyeOffIcon size={18} className="text-gray-500" />
          ) : (
            <EyeIcon size={18} className="text-gray-700" />
          )}
        </button>
      </div>

      {!section.hidden && (
        <div>
          {section.items.map(item => renderItemEditor(item))}
          
          <button
            onClick={onAddItem}
            className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
          >
            <PlusIcon size={16} className="mr-1" /> 
            {sectionKey === 'educationSection' && 'Add Education'}
            {sectionKey === 'experienceSection' && 'Add Experience'}
            {sectionKey === 'projectSection' && 'Add Project'}
            {sectionKey === 'skillSection' && 'Add Skill'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionItemEditor;
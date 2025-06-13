import React, { useState, useEffect, useRef } from 'react';
import { PenIcon, CheckIcon, XIcon } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date';
  label?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit',
  className = '',
  multiline = false,
  type = 'text',
  label,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`relative group ${className}`}>
        {label && <label className="text-xs text-gray-500 mb-1 block">{label}</label>}
        
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] resize-y"
            autoFocus
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
          />
        )}
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <button 
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Save"
          >
            <CheckIcon size={16} />
          </button>
          <button 
            onClick={handleCancel}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Cancel"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group cursor-pointer transition-all hover:bg-gray-50 p-2 rounded ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
      
      {multiline ? (
        <div className="whitespace-pre-wrap">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
      ) : (
        <div>
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
      )}
      
      <button 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm border"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        title="Edit"
      >
        <PenIcon size={14} className="text-blue-600" />
      </button>
    </div>
  );
};

export default EditableField; 
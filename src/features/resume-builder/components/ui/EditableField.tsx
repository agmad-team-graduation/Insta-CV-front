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
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
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
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        
        <div className="relative">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px] resize-y transition-all duration-200 shadow-sm"
              rows={4}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
            />
          )}
          
          <div className="absolute right-2 top-2 flex space-x-1">
            <button 
              onClick={handleSave}
              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all duration-200"
              title="Save"
            >
              <CheckIcon size={16} />
            </button>
            <button 
              onClick={handleCancel}
              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
              title="Cancel"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div 
        className="relative group cursor-pointer transition-all duration-200 hover:bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm"
        onClick={() => setIsEditing(true)}
      >
        {multiline ? (
          <div className="whitespace-pre-wrap text-gray-900 min-h-[1.5rem]">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </div>
        ) : (
          <div className="text-gray-900 min-h-[1.5rem] flex items-center">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </div>
        )}
        
        <button 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:border-blue-300 hover:shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Edit"
        >
          <PenIcon size={14} className="text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default EditableField; 
import React, { useState, useEffect, useRef } from 'react';
import { PenIcon } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date';
  label?: string;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit',
  className = '',
  multiline = false,
  type = 'text',
  label,
  isEditing = false,
  onEditStart,
  onEditEnd,
}) => {
  const [editValue, setEditValue] = useState(value);
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleClick = () => {
    if (!isEditing && !isLocalEditing) {
      setIsLocalEditing(true);
      onEditStart?.();
    }
  };

  const handleBlur = () => {
    setIsLocalEditing(false);
    onEditEnd?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsLocalEditing(false);
      onEditEnd?.();
    } else if (e.key === 'Enter' && !multiline) {
      setIsLocalEditing(false);
      onEditEnd?.();
    }
  };

  const isActuallyEditing = isEditing || isLocalEditing;

  if (isActuallyEditing)
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        
        <div className="relative">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                onChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px] resize-y transition-all duration-200 shadow-sm"
              rows={4}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                onChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
            />
          )}
        </div>
      </div>
    );

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      className={`space-y-1 ${className}`}
    >
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative group cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg">
        {multiline ? (
          <div className="whitespace-pre-wrap text-gray-900 min-h-[1.5rem] px-3 py-2">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </div>
        ) : (
          <div className="text-gray-900 min-h-[1.5rem] flex items-center px-3 py-2">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </div>
        )}
        
        <div 
          role="button"
          tabIndex={0}
          className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <PenIcon size={14} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default EditableField; 
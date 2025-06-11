import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

function EditorAccordion({
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  isCustomTitle = false,
}) {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <button
        className="w-full p-3 font-medium text-left bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        {isCustomTitle ? (
          title
        ) : (
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
        )}
        <div>
          {isExpanded ? (
            <ChevronUpIcon size={18} className="text-gray-600" />
          ) : (
            <ChevronDownIcon size={18} className="text-gray-600" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3 bg-white">{children}</div>
      </div>
    </div>
  );
}

export default EditorAccordion;
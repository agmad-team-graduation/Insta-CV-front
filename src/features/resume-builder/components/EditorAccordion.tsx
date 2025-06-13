import React, { ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface EditorAccordionProps {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isCustomTitle?: boolean;
}

const EditorAccordion: React.FC<EditorAccordionProps> = ({
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  isCustomTitle = false,
}) => {
  return (
    <div className="overflow-hidden">
      <button
        className="w-full py-2 font-semibold text-left flex items-center justify-between hover:opacity-80 transition-all duration-200"
        onClick={onToggle}
      >
        {isCustomTitle ? (
          title
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white bg-opacity-50">
              {icon}
            </div>
            <span className="text-gray-800">{title}</span>
          </div>
        )}
        <div className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-all duration-200">
          {isExpanded ? (
            <ChevronUpIcon size={18} className="text-gray-600" />
          ) : (
            <ChevronDownIcon size={18} className="text-gray-600" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-2">{children}</div>
      </div>
    </div>
  );
};

export default EditorAccordion; 
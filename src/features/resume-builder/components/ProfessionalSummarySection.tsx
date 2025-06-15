import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import EditableField from './ui/EditableField';

interface ProfessionalSummarySectionProps {
  summary: string;
  sectionTitle: string;
  hidden: boolean;
}

const ProfessionalSummarySection: React.FC<ProfessionalSummarySectionProps> = ({ 
  summary, 
  sectionTitle, 
  hidden 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { toggleSectionVisibility, updateSummary, updateSummaryTitle, resume } = useResumeStore();

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Bar */}
      <div className="border-b border-gray-100">
        <button
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3" onClick={handleTitleClick}>
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <BookOpenIcon size={18} />
            </div>
            <EditableField
              value={resume?.summaryTitle || sectionTitle}
              onChange={(value) => updateSummaryTitle(value)}
              className="!p-0 hover:bg-transparent font-semibold text-lg text-gray-900"
              onEditStart={() => setIsEditingTitle(true)}
              onEditEnd={() => setIsEditingTitle(false)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility('summary');
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
        </button>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
              placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummarySection; 
 
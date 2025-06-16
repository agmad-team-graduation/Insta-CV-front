import React, { useState } from 'react';
import { 
  UserIcon, 
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { PersonalDetails } from '../types/index';
import useResumeStore from '../store/resumeStore';

interface PersonalDetailsSectionProps {
  personalDetails: PersonalDetails;
  sectionTitle: string;
  hidden: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({ 
  personalDetails, 
  sectionTitle, 
  hidden,
  isExpanded,
  onToggle
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Bar */}
      <div className="border-b border-gray-100">
        <button
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <UserIcon size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={personalDetails.fullName}
                onChange={(e) => useResumeStore.getState().updatePersonalDetails({ fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={personalDetails.jobTitle}
                onChange={(e) => useResumeStore.getState().updatePersonalDetails({ jobTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={personalDetails.email}
                onChange={(e) => useResumeStore.getState().updatePersonalDetails({ email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., john.doe@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={personalDetails.phone}
                onChange={(e) => useResumeStore.getState().updatePersonalDetails({ phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={personalDetails.address}
                onChange={(e) => useResumeStore.getState().updatePersonalDetails({ address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., New York, NY, USA"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection; 
import React from 'react';
import { Code } from 'lucide-react';

const SkillsSection = ({ requiredSkills }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Required Skills</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {requiredSkills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
          >
            {typeof skill === 'string' ? skill : (skill.skill || 'Unknown')}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection; 
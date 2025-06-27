import React from 'react';
import { Target, CheckCircle, XCircle } from 'lucide-react';

const SkillsMatching = ({
  matchedSkills,
  missingSkills,
  matchPercentage
}) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Skills Matching</h2>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="#10b981"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{matchPercentage}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">Skills Match Rate</p>
        </div>
        
        {/* Matched Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Matched Skills</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {matchedSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              {missingSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsMatching; 
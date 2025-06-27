import React from 'react';
import { FileText } from 'lucide-react';

const JobDescription = ({
  description,
  requirements,
  responsibilities
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
        
        {(requirements || responsibilities) && (
          <div className="grid md:grid-cols-2 gap-8">
            {responsibilities && responsibilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {requirements && requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescription; 
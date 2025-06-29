import React from 'react';
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react';

const JobHeader = ({
  title,
  company,
  location,
  salary,
  type,
  postedDate
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-semibold text-gray-700">{company}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-gray-600">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
            {salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>{salary}</span>
              </div>
            )}
            {type && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{type}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            {postedDate || "Recently Posted"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader; 
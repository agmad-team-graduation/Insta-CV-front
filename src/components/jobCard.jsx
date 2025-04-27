import React from 'react';
import { Calendar, MapPin, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const shortDescription = job.description.length > 100 
    ? `${job.description.substring(0, 100)}...` 
    : job.description;

  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <div className="flex space-x-2">
            {job.type && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                job.type === 'Remote' ? 'bg-indigo-100 text-indigo-800' :
                job.type === 'Hybrid' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {job.type}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
          
          {job.location && (
            <>
              <span className="mx-2">•</span>
              <MapPin size={14} className="mr-1" />
              <span>{job.location}</span>
            </>
          )}
          
          {job.openings > 0 && (
            <>
              <span className="mx-2">•</span>
              <Users size={14} className="mr-1" />
              <span>{job.openings} {job.openings === 1 ? 'opening' : 'openings'}</span>
            </>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{shortDescription}</p>
        
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <Link 
          to={`/job-details/${job.id}`}
          className="flex items-center justify-center w-full py-2 mt-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
        >
          <Info size={16} className="mr-1" />
          View details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
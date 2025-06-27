import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

const SimilarJobs = ({ jobs, onJobClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Similar Jobs</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.slice(0, 6).map((job, idx) => (
            <div
              key={job.id || idx}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
              onClick={() => onJobClick(job.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.title || 'No Title'}
                  </h3>
                  <p className="text-gray-600 font-medium mb-2">{job.company || 'Unknown Company'}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <div className="space-y-2 mb-4">
                {job.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    (job.matchPercentage || 75) >= 80 ? 'bg-green-500' :
                    (job.matchPercentage || 75) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {job.matchPercentage || 75}% match
                  </span>
                </div>
                <span className="text-xs text-gray-500">{job.postedDate || "Recently"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No similar jobs found</h4>
            <p className="text-gray-500 text-center max-w-xs">We couldn't find any similar jobs for you at the moment. Please check back later for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarJobs; 
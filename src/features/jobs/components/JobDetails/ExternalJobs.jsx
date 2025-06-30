import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

const ExternalJobs = ({ jobs, onJobClick, currentJobId }) => {
  // Helper function to generate a unique key for each job
  const generateJobKey = (job, index) => {
    if (job.id) return `job-${job.id}`;
    if (job.title && job.company) return `job-${job.title}-${job.company}-${index}`;
    if (job.title) return `job-${job.title}-${index}`;
    return `job-unknown-${index}`;
  };

  // Get skill matching percentage for jobs - same logic as JobCard.jsx
  const getMatchPercentage = (job) => {
    if (job.skillMatchingAnalysis?.matchedSkillsPercentage !== undefined) {
      return Math.ceil(job.skillMatchingAnalysis.matchedSkillsPercentage);
    }
    // Fallback to matchPercentage if available, otherwise default to 75
    return job.matchPercentage ? Math.ceil(job.matchPercentage) : 75;
  };

  // Function to get random 3 jobs from the array, excluding the current job
  const getRandomJobs = (jobsArray, count = 3) => {
    if (!jobsArray || jobsArray.length === 0) return [];
    
    // Filter out the current job
    const filteredJobs = jobsArray.filter(job => job.id !== currentJobId);
    
    // If we have fewer jobs than requested after filtering, return all available
    if (filteredJobs.length <= count) return filteredJobs;
    
    // Create a copy of the array to avoid mutating the original
    const shuffled = [...filteredJobs];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 3 jobs from the shuffled array
    return shuffled.slice(0, count);
  };

  // Get random 3 jobs (excluding current job)
  const randomJobs = getRandomJobs(jobs, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Other Jobs</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomJobs && randomJobs.length > 0 ? (
          randomJobs.map((job, idx) => (
            <div
              key={generateJobKey(job, idx)}
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
                    getMatchPercentage(job) >= 90 ? 'bg-green-500' :
                    getMatchPercentage(job) >= 75 ? 'bg-yellow-500' :
                    getMatchPercentage(job) >= 50 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {getMatchPercentage(job)}% match
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
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No additional jobs found</h4>
            <p className="text-gray-500 text-center max-w-xs">We couldn't find any additional jobs for you at the moment. Please check back later for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalJobs; 
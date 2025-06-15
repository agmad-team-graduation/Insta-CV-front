import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, MapPin, Users, Info, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobAnalysisDialog from './JobAnalysisDialog';
import apiClient from "@/common/utils/apiClient";

const JobCard = ({ job, isRecommended = false }) => {
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const navigate = useNavigate();

  const shortDescription = job.description.length > 100 
    ? `${job.description.substring(0, 100)}...` 
    : job.description;

  // Use the 'date' property if available, otherwise fallback to 'postedDate'
  let displayDate = '';
  console.log(job);
  if (job.date) {
    const d = new Date(job.date);
    displayDate = isNaN(d) ? job.date : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } else if (job.addDate) {
    const d = new Date(job.addDate);
    displayDate = isNaN(d) ? job.postedDate : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } else {
    displayDate = 'Invalid date';
  }

  useEffect(() => {
    // Clean up polling interval when component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const checkJobStatus = useCallback(async (jobId) => {
    try {
      const endpoint = isRecommended ? `/api/v1/jobs/scrape/${job.id}` : `/api/v1/jobs/${job.id}`;
      const response = await apiClient.get(endpoint);
      
      if (response.data.analyzed && response.data.skillMatchingAnalyzed) {
        // Job is analyzed, clear interval and navigate
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setIsAnalysisDialogOpen(false);
        navigate(`/job-details/${jobId}`);
      }
    } catch (error) {
      console.error("Error checking job status:", error);
      // Stop polling on error
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setIsAnalysisDialogOpen(false);
    }
  }, [navigate, pollingInterval]);

  const handleViewDetails = async (e) => {
    e.preventDefault();
    
    try {
      setIsAnalysisDialogOpen(true);
      const endpoint = isRecommended ? `/api/v1/jobs/scrape/${job.id}` : `/api/v1/jobs/${job.id}`;
      const response = await apiClient.get(endpoint);
      
      if ((response.data.analyzed && response.data.skillMatchingAnalyzed) || !!isRecommended) {
        // If already analyzed, go directly to job details
        navigate(`/job-details/${job.id}`);
      } else {
        // Start polling for job analysis status
        console.log(job);
        setCurrentJob(job);
        setIsAnalysisDialogOpen(true);
        
        // Poll every 5 seconds
        const interval = setInterval(() => {
          checkJobStatus(job.id);
        }, 5000);
        
        setPollingInterval(interval);
      }
    } catch (error) {
      console.error("Error checking job analysis status:", error);
      // On error, navigate to details page anyway
      navigate(`/job-details/${job.id}`);
    }
  };

  const handleDeleteJob = async (e) => {
    e.stopPropagation();
    
    try {
      await apiClient.delete(`/api/v1/jobs/${job.id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
      <button 
        onClick={handleDeleteJob}
        className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors z-10"
        aria-label="Delete job"
      >
        <X size={16} />
      </button>

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
          <span>{displayDate}</span>
          
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
        
        <button
          onClick={handleViewDetails}
          className="flex items-center justify-center w-full py-2 mt-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
        >
          <Info size={16} className="mr-1" />
          View details
        </button>
      </div>

      <JobAnalysisDialog 
        open={isAnalysisDialogOpen} 
        onOpenChange={setIsAnalysisDialogOpen}
      />
    </div>
  );
};

export default JobCard;
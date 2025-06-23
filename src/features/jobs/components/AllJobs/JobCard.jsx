import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, MapPin, Users, Info, X, Target, Building2, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobAnalysisDialog from './JobAnalysisDialog';
import apiClient from "@/common/utils/apiClient";
import { toast } from 'sonner';
import { Card, CardContent } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";

const JobCard = ({ job, isRecommended = false, onJobDelete }) => {
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const navigate = useNavigate();

  const shortDescription = job.description.length > 100 
    ? `${job.description.substring(0, 100)}...` 
    : job.description;

  // Use the 'date' property if available, otherwise fallback to 'postedDate'
  let displayDate = '';
  if (job.date) {
    const d = new Date(job.date);
    displayDate = isNaN(d) ? job.date : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } else if (job.addDate) {
    const d = new Date(job.addDate);
    displayDate = isNaN(d) ? job.postedDate : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } else {
    displayDate = 'Invalid date';
  }

  // Get skill matching percentage for recommended jobs
  const getSkillMatchPercentage = () => {
    if (job.skillMatchingAnalysis?.matchedSkillsPercentage !== undefined) {
      return Math.ceil(job.skillMatchingAnalysis.matchedSkillsPercentage);
    }
    return null;
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
    if (percentage >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMatchCircleColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMatchGradient = (percentage) => {
    if (percentage >= 90) return 'from-green-500 to-green-600';
    if (percentage >= 75) return 'from-yellow-500 to-yellow-600';
    if (percentage >= 50) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

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
      onJobDelete(job.id);
      toast.success("Job deleted successfully");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Cannot delete this job because it is related to an existing resume");
      } else {
        toast.error("Failed to delete job. Make sure all related resumes are deleted first.");
      }
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02]">
      {/* Job ID Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs font-mono">
          #{job.id}
        </Badge>
      </div>

      {/* Delete Button */}
      <div className="absolute top-4 right-4 z-10">
        {!isRecommended && (
          <button 
            onClick={handleDeleteJob}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Delete job"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <CardContent className="p-6">
        {/* Header with title and match indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center mt-2 text-gray-600">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{job.company || 'Unknown Company'}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {/* Skill Match Circle for Recommended Jobs */}
            {getSkillMatchPercentage() !== null && (
              <div className="relative flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`bg-gradient-to-r ${getMatchGradient(getSkillMatchPercentage())}`}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${getSkillMatchPercentage()}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold ${getMatchCircleColor(getSkillMatchPercentage())}`}>
                    {getSkillMatchPercentage()}%
                  </span>
                </div>
              </div>
            )}
            
            {/* Job Type Badge */}
            {job.type && (
              <Badge className={`px-3 py-1 text-xs font-medium rounded-full ${
                job.type === 'Remote' ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' :
                job.type === 'Hybrid' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}>
                {job.type}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Job Details */}
        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{displayDate}</span>
          </div>
          
          {job.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.openings > 0 && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{job.openings} {job.openings === 1 ? 'opening' : 'openings'}</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{shortDescription}</p>
        
        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <Info size={16} />
          <span>View Details</span>
        </button>
      </CardContent>

      <JobAnalysisDialog 
        open={isAnalysisDialogOpen} 
        onOpenChange={setIsAnalysisDialogOpen}
      />
    </Card>
  );
};

export default JobCard;
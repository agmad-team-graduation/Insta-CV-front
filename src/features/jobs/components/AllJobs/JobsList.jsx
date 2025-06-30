import React, { useState, useEffect } from 'react';
import apiClient from '@/common/utils/apiClient';
import JobCard from './JobCard';
import { Briefcase, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { useCookies } from 'react-cookie';
import PageLoader from "@/common/components/ui/PageLoader";

const PAGE_SIZE = 9;

const JobsList = ({ isRecommended = false, refreshTrigger = 0 }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [cookies] = useCookies(['isLoggedIn']);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const endpoint = isRecommended 
        ? `/api/v1/jobs/scrape/get-recommendations?page=${currentPage - 1}&size=${PAGE_SIZE}`
        : `/api/v1/jobs/all?page=${currentPage - 1}&size=${PAGE_SIZE}`;
      
      const response = await apiClient.get(endpoint);
      
      // Handle both response formats (content array or direct array)
      let jobsData = response.data.content || response.data;
      // if (isRecommended) {
      //   jobsData = jobsData.filter(job => job.skillMatchingAnalysis?.matchedSkillsPercentage > 0);
      // }
      const totalPagesData = response.data.totalPages || 1;
      

      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
        setTotalPages(totalPagesData);
      } else {
        setJobs([]);
        setTotalPages(0);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error(err);
      setJobs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [currentPage, isRecommended, refreshTrigger]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleJobDelete = (deletedJobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== deletedJobId));
    // If we're on the last page and delete the last item, go to previous page
    if (jobs.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Jobs" 
        subtitle="We're fetching your job opportunities..."
        size="small"
      />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {jobs.length === 0 && !loading && (
          <>  
            <div className="text-center py-8 px-4">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  {isRecommended && (
                    <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No New External Jobs Yet</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We're continuously analyzing new opportunities for you. Check back later for fresh External Jobs.
                    </p>
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <p className="text-xs text-gray-500">
                        💡 <strong>Tip:</strong> If you recently updated your profile, try searching for External Jobs again to get the latest matches.
                      </p>
                    </div>
                    </>
                  )}
                  {!isRecommended && (
                    <p className="text-gray-500">No jobs found. Please add a job to your profile to get started.</p>
                  )}
                </div>
              </div>
            </div>
          </>
      )}

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              isRecommended={isRecommended} 
              onJobDelete={handleJobDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobsList;
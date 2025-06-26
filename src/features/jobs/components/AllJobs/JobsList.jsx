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
      const jobsData = response.data.content || response.data;
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
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No jobs found</h3>
          <p className="text-gray-500">Check back later for new opportunities, or try a different page.</p>
        </div>
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
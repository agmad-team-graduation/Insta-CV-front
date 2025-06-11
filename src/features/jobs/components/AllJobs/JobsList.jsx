import React, { useState, useEffect } from 'react';
import { fetchJobs } from "../../services/fetchJobs";
import { useCookies } from 'react-cookie';
import JobCard from './JobCard';
import { Briefcase, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/common/components/ui/button";

const PAGE_SIZE = 9;

const JobsList = ({ jobs: externalJobs, loading: externalLoading, error: externalError }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [cookies] = useCookies(['isLoggedIn']);

  useEffect(() => {
    if (externalJobs) {
      setJobs(externalJobs);
      setLoading(!!externalLoading);
      setError(externalError || null);
      setTotalPages(1); // No pagination for external jobs
      return;
    }
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs(currentPage - 1, PAGE_SIZE);
        setJobs(response || []);
        setTotalPages(response.totalPages || 0);
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
    loadJobs();
  }, [currentPage, activeTab, externalJobs, externalLoading, externalError]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  const displayJobs = jobs;

  return (
    <div>
      {!externalJobs && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'matched'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('matched');
              setCurrentPage(1);
            }}
          >
            Jobs matches your profile 
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
          >
            All active jobs
          </button>
        </div>
      )}
      
      {displayJobs.length === 0 && (!externalJobs || activeTab === 'all') && !loading && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No jobs found</h3>
          <p className="text-gray-500">Check back later for new opportunities, or try a different page.</p>
        </div>
      )}

      {!externalJobs && activeTab === 'matched' && (
         <div className="text-center text-gray-500 py-10">Matched jobs functionality with pagination not fully implemented.</div>
      )}

      {(externalJobs || activeTab === 'all') && displayJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} isRecommended={!!externalJobs} />
          ))}
        </div>
      )}

      {!externalJobs && totalPages > 1 && activeTab === 'all' && (
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
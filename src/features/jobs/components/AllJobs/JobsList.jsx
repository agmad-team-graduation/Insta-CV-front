import React, { useState, useEffect } from 'react';
import apiClient from '@/common/utils/apiClient';
import JobCard from './JobCard';
import { Briefcase, Loader, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { useCookies } from 'react-cookie';

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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
        </div>
        <p className="text-gray-600 mt-4 text-lg font-medium">Loading jobs...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your opportunities</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Jobs</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={loadJobs}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.length === 0 && !loading && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isRecommended ? 'No Recommended Jobs Found' : 'No Jobs Found'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isRecommended 
                ? "We couldn't find any jobs that match your profile at the moment. Check back later for new opportunities!"
                : "You haven't added any jobs yet. Start by adding your first job opportunity."
              }
            </p>
            {!isRecommended && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {jobs.length > 0 && (
        <>
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1} 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === page 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages} 
                variant="outline" 
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsList;
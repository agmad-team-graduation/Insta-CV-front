import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import JobsList from '../AllJobs/JobsList';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';

const RecommendedJobs = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasCheckedInitialJobs, setHasCheckedInitialJobs] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleForceSearch = async () => {
    try {
      // Show immediate feedback to user
      toast.info('Searching and analyzing external jobs. This may take a few minutes. You can continue browsing while we work in the background.');
      
      // Make the API call without blocking the UI
      apiClient.post('/api/v1/jobs/scrape/analyze-recommendations')
        .then(() => {
          // Trigger a refresh of the job list when the analysis is complete
          setRefreshTrigger(prev => prev + 1);
          toast.success('External Jobs analyzed successfully! New jobs are now available.');
        })
        .catch((err) => {
          console.error('Error analyzing External Jobs:', err);
          toast.error('Failed to analyze External Jobs. Please try again.');
        });
    } catch (err) {
      console.error('Error initiating External Jobs search:', err);
      toast.error('Failed to start External Jobs search. Please try again.');
    }
  };

  // Check if there are any jobs initially and auto-trigger search if none found
  useEffect(() => {
    const checkInitialJobs = async () => {
      if (hasCheckedInitialJobs) return;
      
      try {
        const response = await apiClient.get('/api/v1/jobs/scrape/get-recommendations?page=0&size=1');
        const jobsData = response.data.content || response.data;
        
        if (!jobsData || jobsData.length === 0) {
          // No jobs found, automatically trigger search
          handleForceSearch();
        }
        
        setHasCheckedInitialJobs(true);
      } catch (error) {
        console.error('Error checking initial jobs:', error);
        setHasCheckedInitialJobs(true);
      }
    };

    checkInitialJobs();
  }, [hasCheckedInitialJobs]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              External Jobs
            </h1>
            <div className="flex space-x-4 items-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleForceSearch}
              >
                Search for External Jobs
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 text-lg font-medium focus:outline-none transition-colors duration-200 ${location.pathname === '/jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => navigate('/jobs')}
            >
              My Jobs
            </button>
            <button
              className={`py-4 px-1 border-b-2 text-lg font-medium focus:outline-none transition-colors duration-200 ${location.pathname === '/recommended-jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => navigate('/recommended-jobs')}
            >
              External Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Main content area with flex-grow to push footer down */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="min-h-[calc(100vh-16rem)]">
          <JobsList isRecommended={true} refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
};

export default RecommendedJobs;

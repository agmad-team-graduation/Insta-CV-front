import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import JobsList from '../AllJobs/JobsList';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';

const RecommendedJobs = () => {
  const [forceLoading, setForceLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleForceSearch = async () => {
    setForceLoading(true);
    try {
      await apiClient.post('/api/v1/jobs/scrape/analyze-recommendations');
      // Trigger a refresh of the job list
      setRefreshTrigger(prev => prev + 1);
      toast.success('Recommendations analyzed successfully');
    } catch (err) {
      console.error('Error analyzing recommendations:', err);
      toast.error('Failed to analyze recommendations. Please try again.');
    } finally {
      setForceLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              Recommended Jobs
            </h1>
            <div className="flex space-x-4 items-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleForceSearch}
                disabled={forceLoading}
              >
                {forceLoading ? 'Searching...' : 'Search for Recommendations'}
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
              Recommended Jobs
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

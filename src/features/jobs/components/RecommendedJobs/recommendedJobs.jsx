import React, { useEffect, useState } from 'react';
import apiClient from '@/common/utils/apiClient';
import JobsList from '../AllJobs/JobsList';
import { Briefcase } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Innovators',
    description: 'Work with React and modern JavaScript to build amazing user interfaces.'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'Cloud Solutions',
    description: 'Design and implement scalable backend services using Node.js and Express.'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Startup Hub',
    description: 'Join a fast-paced team to deliver end-to-end web solutions.'
  }
];

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/jobs/scrape/get-recommendations');
      if (response.data.content) {
        setJobs(response.data.content);
      } else {
        setJobs(MOCK_JOBS);
      }
      setError(null);
    } catch (err) {
      setJobs(MOCK_JOBS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const handleForceSearch = async () => {
    setForceLoading(true);
    try {
      const response = await apiClient.post('/api/v1/jobs/scrape/analyze-recommendations');
      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
      } else if (response.data && response.data.content) {
        setJobs(response.data.content);
      } else {
        setJobs(MOCK_JOBS);
      }
      setError(null);
    } catch (err) {
      setJobs(MOCK_JOBS);
      setError(null);
    } finally {
      setForceLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
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
      <div className="bg-white border-b border-gray-200">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobsList jobs={jobs} loading={loading || forceLoading} error={error} />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecommendedJobs;

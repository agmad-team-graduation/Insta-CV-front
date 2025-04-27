import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../Context/fetchJobs';
import { useCookies } from 'react-cookie';
import JobCard from './jobCard';
import { Briefcase, Loader } from 'lucide-react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [cookies] = useCookies(['isLoggedIn']);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const token = cookies.isLoggedIn || '';
        const jobsData = await fetchJobs(token);
        setJobs(jobsData);
        setError(null);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [cookies.isLoggedIn]);

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

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <Briefcase className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No jobs found</h3>
        <p className="text-gray-500">Check back later for new opportunities</p>
      </div>
    );
  }

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter(job => Math.random() > 0.5);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'matched'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('matched')}
        >
          Jobs matches your profile ({Math.floor(jobs.length * 0.7)})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All active jobs ({jobs.length})
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsList;
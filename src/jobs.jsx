import React from 'react';
import JobsList from './components/jobsList';
import { Briefcase, Filter } from 'lucide-react';

const Jobs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              Active Jobs
            </h1>
            <div className="flex space-x-4 items-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm hidden md:flex items-center">
                <Filter className="mr-1 h-4 w-4" />
                Filter Results
              </button>
              <a href="/applied-jobs" className="text-blue-600 hover:underline text-sm">
                Applied jobs <span className="text-xs">→</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobsList />
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

export default Jobs;
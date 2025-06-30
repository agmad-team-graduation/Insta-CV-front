import React, { useState } from 'react';
import JobsList from "./JobsList";
import { Briefcase, Filter, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import AddJobDialog from '../AddJob/AddJobDialog';

const JobsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobAdded = () => {
    // Increment refreshTrigger to trigger a refresh of the jobs list
    setRefreshTrigger(prev => prev + 1);
    setShowAddJobDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              Active Jobs
            </h1>
            <div className="flex space-x-4 items-center">
              <Button 
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddJobDialog(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Add Job</span>
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
          <JobsList refreshTrigger={refreshTrigger} />
        </div>
      </main>
      
      <AddJobDialog 
        open={showAddJobDialog}
        onOpenChange={setShowAddJobDialog}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
};

export default JobsPage;
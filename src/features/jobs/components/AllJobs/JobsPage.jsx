import React, { useState } from 'react';
import JobsList from "./JobsList";
import { Briefcase, Filter, Plus, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Job Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Track and manage your career opportunities</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 rounded-xl"
                onClick={() => setShowAddJobDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-500 mt-1">+8 this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded p-1">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Recommended</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 mt-1">Based on your profile</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded p-1">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Match Rate</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-500 mt-1">Average skill match</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded p-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 text-lg font-medium focus:outline-none transition-all duration-200 relative ${
                location.pathname === '/jobs' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => navigate('/jobs')}
            >
              <span className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>My Jobs</span>
                {location.pathname === '/jobs' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">
                    Active
                  </Badge>
                )}
              </span>
            </button>
            <button
              className={`py-4 px-1 border-b-2 text-lg font-medium focus:outline-none transition-all duration-200 relative ${
                location.pathname === '/recommended-jobs' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => navigate('/recommended-jobs')}
            >
              <span className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Recommended Jobs</span>
                {location.pathname === '/recommended-jobs' && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 ml-2">
                    AI Powered
                  </Badge>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[calc(100vh-24rem)]">
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
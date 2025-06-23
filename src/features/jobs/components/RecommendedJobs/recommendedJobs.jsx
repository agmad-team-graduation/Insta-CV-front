import React, { useState } from 'react';
import { Briefcase, Target, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate, useLocation } from 'react-router-dom';
import JobsList from '../AllJobs/JobsList';
import apiClient from '@/common/utils/apiClient';

const RecommendedJobs = () => {
  const [forceLoading, setForceLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleForceSearch = async () => {
    setForceLoading(true);
    try {
      await apiClient.post('/api/v1/jobs/scrape/analyze-recommendations');
      // The JobsList component will handle fetching the updated recommendations
    } catch (err) {
      console.error('Error analyzing recommendations:', err);
    } finally {
      setForceLoading(false);
    }
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Job Recommendations
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Discover opportunities tailored to your skills</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 rounded-xl"
                onClick={handleForceSearch}
                disabled={forceLoading}
              >
                {forceLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Recommendations
                  </>
                )}
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
                  <p className="text-sm font-medium text-gray-600 mb-1">AI Recommendations</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Average Match</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-500 mt-1">Skill compatibility</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded p-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900">2h ago</p>
                  <p className="text-xs text-gray-500 mt-1">Fresh opportunities</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded p-1">
                    <RefreshCw className="w-4 h-4 text-white" />
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
          <JobsList isRecommended={true} />
        </div>
      </main>
    </div>
  );
};

export default RecommendedJobs;

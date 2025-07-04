import StatsCards from '../components/StatsCards';
import ProfileSkills from '../components/ProfileSkills';
import JobsGrid from '../components/JobsGrid';
import CVsList from '../components/CVsList';
import QuickActions from '../components/QuickActions';
import { useState } from 'react';

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobAdded = () => {
    // Trigger a refresh of the jobs grid
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsCards />
        
        {/* Quick Actions */}
        <QuickActions onJobAdded={handleJobAdded} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Profile Skills */}
          <div className="lg:col-span-1">
            <ProfileSkills />
          </div>
          
          {/* Jobs and CVs */}
          <div className="lg:col-span-2 space-y-8">
            <JobsGrid refreshTrigger={refreshTrigger} />
            <CVsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

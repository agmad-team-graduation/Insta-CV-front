import StatsCards from '../components/StatsCards';
import ProfileSkills from '../components/ProfileSkills';
import JobsGrid from '../components/JobsGrid';
import CVsList from '../components/CVsList';
import QuickActions from '../components/QuickActions';

console.log("A&aaa")

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Overview */}
        <StatsCards />
        
        {/* Quick Actions */}
        <QuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mt-4 md:mt-8">
          {/* Profile Skills */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ProfileSkills />
          </div>
          
          {/* Jobs and CVs */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8 order-1 lg:order-2">
            <JobsGrid />
            <CVsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

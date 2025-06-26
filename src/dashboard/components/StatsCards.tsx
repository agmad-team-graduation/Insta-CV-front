import { Card, CardContent } from '@/common/components/ui/card';
import apiClient from '@/common/utils/apiClient';
import { FileText , Briefcase, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ComponentLoader from '@/common/components/ui/ComponentLoader';

const StatsCards = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate match percentage for a job (same logic as JobsGrid)
  const calculateMatchPercentage = (job: any) => {
    if (!job.skillMatchingAnalysis?.matchedSkills) {
      return null;
    }
    
    const totalSkills = job.hardSkills.length;
    const matchedSkills = job.skillMatchingAnalysis.matchedSkills.length;
    
    if (totalSkills === 0) return 0;
    
    return Math.round((matchedSkills / totalSkills) * 100);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats
        const statsResponse = await apiClient.get('/api/dashboard/stats');
        const statsData = statsResponse.data.stats || [];
        
        // Fetch jobs to calculate average match percentage
        const jobsResponse = await apiClient.get('/api/v1/jobs/all');
        const jobs = jobsResponse.data.content || [];
        
        // Calculate average match percentage
        const matchPercentages = jobs
          .map(calculateMatchPercentage)
          .filter((percentage: number | null): percentage is number => percentage !== null);
        
        const averageMatch = matchPercentages.length > 0 
          ? Math.round(matchPercentages.reduce((sum: number, percentage: number) => sum + percentage, 0) / matchPercentages.length)
          : 0;
        
        // Create default stats if API doesn't return enough data
        const defaultStats = [
          {
            title: 'Total CVs',
            value: '0',
            change: 'No CVs yet',
            icon: FileText,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Saved Jobs',
            value: '0',
            change: 'No jobs saved',
            icon: Briefcase,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          }
        ];
        
        // Use API data if available, otherwise use defaults
        const finalStats = statsData.length >= 2 ? statsData.slice(0, 2) : defaultStats;
        
        // Configure stats with icons and colors
        if (finalStats[0]) {
          finalStats[0].icon = FileText;
          finalStats[0].color = 'from-blue-500 to-blue-600';
          finalStats[0].bgColor = 'bg-blue-50';
        }
        if (finalStats[1]) {
          finalStats[1].icon = Briefcase;
          finalStats[1].color = 'from-green-500 to-green-600';
          finalStats[1].bgColor = 'bg-green-50';
        }
        
        // Add the average match percentage as a third stat
        const averageMatchStat = {
          title: 'Average Match',
          value: `${averageMatch}%`,
          change: `${matchPercentages.length} jobs analyzed`,
          icon: TrendingUp,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-50'
        };
        
        // Combine stats with the new average match stat
        const allStats = [...finalStats, averageMatchStat];
        console.log('Final stats:', allStats); // Debug log
        setStats(allStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set fallback stats even if there's an error
        const fallbackStats = [
          {
            title: 'Total CVs',
            value: '0',
            change: 'Error loading data',
            icon: FileText,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Saved Jobs',
            value: '0',
            change: 'Error loading data',
            icon: Briefcase,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Average Match',
            value: '0%',
            change: '0 jobs analyzed',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          }
        ];
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCardClick = (statTitle: string) => {
    switch (statTitle.toLowerCase()) {
      case 'total cvs':
        navigate('/resumes');
        break;
      case 'saved jobs':
        navigate('/jobs');
        break;
      case 'average match':
        navigate('/jobs');
        break;
      case 'skill matches':
        navigate('/profile');
        break;
      default:
        // Default action for other stats
        console.log('Clicked on:', statTitle);
    }
  };

  if (loading) {
    return <ComponentLoader message="Loading dashboard stats..." size="small" />;
  }

  console.log('Rendering stats:', stats); // Debug log

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat: any, index: number) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm cursor-pointer transform hover:scale-105"
          onClick={() => handleCardClick(stat.title)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <div className={`w-6 h-6 bg-gradient-to-r ${stat.color} rounded p-1`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;

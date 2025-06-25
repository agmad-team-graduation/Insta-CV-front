import { Card, CardContent } from '@/common/components/ui/card';
import apiClient from '@/common/utils/apiClient';
import { FileText , Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StatsCards = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/dashboard/stats');
        const statsData = response.data.stats || [];
        if (statsData[0]) {
          statsData[0].icon = FileText;
          statsData[0].color = 'from-blue-500 to-blue-600';
          statsData[0].bgColor = 'bg-blue-50';
        }
        if (statsData[1]) {
          statsData[1].icon = Briefcase;
          statsData[1].color = 'from-green-500 to-green-600';
          statsData[1].bgColor = 'bg-green-50';
        }
        setStats(statsData);
      } catch (error) {
        setStats([]);
        console.error(error);
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
      case 'skill matches':
        navigate('/profile');
        break;
      default:
        // Default action for other stats
        console.log('Clicked on:', statTitle);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.slice(0, 2).map((stat: any, index: number) => (
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

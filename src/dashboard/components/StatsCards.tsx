import { Card, CardContent } from '@/common/components/ui/card';
import apiClient from '@/common/utils/apiClient';
import { FileText , Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

let stats = [];

try {
  const response = await apiClient.get('/api/dashboard/stats');
  stats = response.data.stats;
  stats[0].icon = FileText;
  stats[0].color = 'from-blue-500 to-blue-600';
  stats[0].bgColor = 'bg-blue-50';
  stats[1].icon = Briefcase;
  stats[1].color = 'from-green-500 to-green-600';
  stats[1].bgColor = 'bg-green-50';
  stats[2].icon = Target;
  stats[2].color = 'from-purple-500 to-purple-600';
  stats[2].bgColor = 'bg-purple-50';
} catch (error) {
  console.error(error);
}

const StatsCards = () => {
  const navigate = useNavigate();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.slice(0, 2).map((stat, index) => (
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

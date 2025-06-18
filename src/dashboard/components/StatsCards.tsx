
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Briefcase, Target } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Total CVs',
      value: '12',
      change: '+2 this month',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saved Jobs',
      value: '24',
      change: '+8 this week',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Skill Matches',
      value: '87%',
      change: 'Avg match rate',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
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

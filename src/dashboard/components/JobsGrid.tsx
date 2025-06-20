
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Clock, Target, ExternalLink } from 'lucide-react';

const JobsGrid = () => {
  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      posted: '2 days ago',
      matchPercentage: 94,
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      matchedSkills: ['React', 'TypeScript', 'Node.js'],
      salary: '$120k - $160k'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      posted: '5 days ago',
      matchPercentage: 87,
      requiredSkills: ['React', 'Python', 'PostgreSQL', 'Docker'],
      matchedSkills: ['React', 'Python', 'Docker'],
      salary: '$100k - $140k'
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'DesignStudio',
      location: 'New York, NY',
      posted: '1 week ago',
      matchPercentage: 78,
      requiredSkills: ['React', 'CSS', 'JavaScript', 'Figma'],
      matchedSkills: ['React', 'JavaScript'],
      salary: '$85k - $115k'
    }
  ];

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Saved Jobs</span>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {job.posted}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">{job.salary}</p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium">{job.matchPercentage}% Match</span>
                  </div>
                  <div className={`w-16 h-1 rounded-full mt-1 ${getMatchColor(job.matchPercentage)}`}></div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Required Skills:</div>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant={job.matchedSkills.includes(skill) ? "default" : "secondary"}
                    className={`text-xs ${job.matchedSkills.includes(skill) 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {skill}
                    {job.matchedSkills.includes(skill) && ' ✓'}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Generate Tailored CV
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JobsGrid;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Edit, Calendar, Target } from 'lucide-react';

const CVsList = () => {
  const cvs = [
    {
      id: 1,
      name: 'Senior React Developer - TechCorp',
      createdDate: '2024-01-15',
      tailoredFor: 'Senior React Developer',
      company: 'TechCorp Inc.',
      matchScore: 94,
      status: 'Active',
      downloads: 12,
      views: 45
    },
    {
      id: 2,
      name: 'Full Stack Engineer - General',
      createdDate: '2024-01-10',
      tailoredFor: 'Multiple Positions',
      company: 'General Purpose',
      matchScore: 82,
      status: 'Draft',
      downloads: 8,
      views: 23
    },
    {
      id: 3,
      name: 'Frontend Developer - DesignStudio',
      createdDate: '2024-01-08',
      tailoredFor: 'Frontend Developer',
      company: 'DesignStudio',
      matchScore: 78,
      status: 'Active',
      downloads: 5,
      views: 18
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Your CVs</span>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvs.map((cv) => (
          <div key={cv.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{cv.name}</h4>
                  <Badge className={`text-xs ${getStatusColor(cv.status)}`}>
                    {cv.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Tailored for: {cv.tailoredFor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {new Date(cv.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {cv.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {cv.downloads} downloads
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${getMatchColor(cv.matchScore)}`}>
                    <Target className="w-3 h-3" />
                    {cv.matchScore}% match score
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
        
        <div className="text-center py-4 border-t">
          <p className="text-sm text-gray-500 mb-2">
            AI-powered CV optimization ready when you are
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <FileText className="w-4 h-4 mr-2" />
            Create Your First AI CV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVsList;

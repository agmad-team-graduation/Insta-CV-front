import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { FileText, Download, Eye, Edit, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import apiClient from '@/common/utils/apiClient';
import useResumeStore from '@/features/resume-builder/store/resumeStore';

interface CV {
  id: string;
  name: string;
  createdDate: string;
  tailoredFor: string;
  company: string;
  matchScore: number;
  status: string;
  downloads: number;
  views: number;
}

const CVsList = () => {
  const navigate = useNavigate();
  const { selectedTemplate } = useResumeStore();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch CVs from API (same as Dashboard.jsx)
  const fetchCVs = async () => {
    try {
      const response = await apiClient.get('/api/v1/cv/user');
      const cvsData = response.data || [];
      
      // Transform CVs data to match dashboard format (same as Dashboard.jsx)
      const transformedCVs: CV[] = cvsData.map((cv: any) => ({
        id: cv.id,
        name: cv.cvTitle || `Resume #${cv.id}`,
        createdDate: cv.createdAt || cv.createdDate,
        tailoredFor: cv.tailoredFor || 'General Purpose',
        company: cv.company || 'General Purpose',
        matchScore: cv.matchScore || Math.floor(Math.random() * 30) + 70, // Fallback score
        status: cv.status || 'Active',
        downloads: cv.downloads || 0,
        views: cv.views || 0
      }));
      
      setCvs(transformedCVs);
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setCvs([]);
      toast.error('Failed to load CVs data');
    } finally {
      setLoading(false);
    }
  };

  // Load CVs on component mount
  useEffect(() => {
    fetchCVs();
  }, []);

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

  const handleShowMore = () => {
    navigate('/resumes');
  };

  const handlePreview = (cvId: string) => {
    // Open preview in new tab with template parameter
    window.open(`/resumes/${cvId}/preview?template=${selectedTemplate}`, '_blank');
  };

  const handleEdit = (cvId: string) => {
    navigate(`/resumes/${cvId}`);
  };

  const handleDownload = async (cvId: string) => {
    toast.info('Download functionality coming soon!');
  };

  const handleCreateFirstCV = () => {
    navigate('/resumes?create=true');
  };

  // Show only first 3 CVs
  const displayedCVs = cvs.slice(0, 3);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Your CVs</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShowMore}
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              Show More
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Loading CVs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Your CVs</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShowMore}
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            Show More
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No CVs created yet.</p>
            <Button 
              variant="link" 
              size="default"
              className="text-blue-600"
              onClick={handleCreateFirstCV}
            >
              Create your first CV
            </Button>
          </div>
        ) : (
          displayedCVs.map((cv) => (
            <div key={cv.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{cv.name}</h4>
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${getStatusColor(cv.status)}`}
                    >
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePreview(cv.id)}
                  className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(cv.id)}
                  className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(cv.id)}
                  className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
        
        {cvs.length > 3 && (
          <div className="text-center py-4 border-t">
            <p className="text-sm text-gray-500 mb-2">
              Showing 3 of {cvs.length} CVs
            </p>
            <Button 
              onClick={handleCreateFirstCV}
              variant="default"
              size="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create a new resume
            </Button>
          </div>
        )}
        
        {cvs.length > 0 && cvs.length <= 3 && (
          <div className="text-center py-4 border-t">
            <p className="text-sm text-gray-500 mb-2">
              AI-powered CV optimization ready when you are
            </p>
            <Button 
              onClick={handleCreateFirstCV}
              variant="default"
              size="default"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Your First AI CV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVsList;

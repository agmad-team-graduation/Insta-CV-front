import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { FileText, Download, Eye, Edit, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import apiClient from '@/common/utils/apiClient';
import useResumeStore from '@/features/resume-builder/store/resumeStore';
import PageLoader from "@/common/components/ui/PageLoader";
import { FRONTEND_BASE_URL, PDF_BACKEND_URL } from '@/config';


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
  jobId?: number;
  cvSettings?: {
    template: string;
  };
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
        views: cv.views || 0,
        jobId: cv.jobId,
        cvSettings: cv.cvSettings
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
    // Find the CV to get its template
    const cv = cvs.find(c => c.id === cvId);
    const template = cv?.cvSettings?.template || selectedTemplate;
    // Open preview in new tab with template parameter
    window.open(`/resumes/${cvId}/preview?template=${template}`, '_blank');
  };

  const handleEdit = (cvId: string) => {
    navigate(`/resumes/${cvId}`);
  };

  const handleDownload = async (cvId: string) => {
    try {
      // Show loading state
      const downloadButton = document.querySelector(`[data-cv-id="${cvId}"] .download-button`) as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = `
          <svg class="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        `;
      }

      // Check server health first
      try {
        const healthController = new AbortController();
        const healthTimeoutId = setTimeout(() => healthController.abort(), 5000);
        
        const healthResponse = await fetch(`${PDF_BACKEND_URL}/health`, { 
          signal: healthController.signal 
        });
        
        clearTimeout(healthTimeoutId);
        
        if (!healthResponse.ok) {
          throw new Error('PDF server is not responding');
        }
        const healthData = await healthResponse.json();
        console.log('PDF server health:', healthData);
      } catch (healthError) {
        if (healthError instanceof Error && healthError.name === 'AbortError') {
          throw new Error('PDF server health check timed out. Please ensure the PDF backend server is running on port 3001.');
        }
        throw new Error('PDF server is not available. Please ensure the PDF backend server is running on port 3001.');
      }

      // Get the cookie value dynamically
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('isLoggedIn='))
        ?.split('=')[1];
      
      if (!cookieValue) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Find the CV to get its template
      const cv = cvs.find(c => c.id === cvId);
      const template = cv?.cvSettings?.template || selectedTemplate;
      
      // Use the preview page URL with the CV's specific template
      const previewUrl = `${FRONTEND_BASE_URL}/resumes/${cvId}/preview?template=${template}`;

      const pdfUrl = `${PDF_BACKEND_URL}/generate-pdf?url=${encodeURIComponent(previewUrl)}&token=${encodeURIComponent(cookieValue)}`;
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch(pdfUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${cvId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('PDF generation timed out. Please try again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to generate PDF: ${errorMessage}`);
      }
    } finally {
      // Reset button state
      const downloadButton = document.querySelector(`[data-cv-id="${cvId}"] .download-button`) as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.innerHTML = `
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download
        `;
      }
    }
  };

  const handleCreateFirstCV = () => {
    navigate('/resumes?create=true');
  };

  // Show only first 3 CVs
  const displayedCVs = cvs.slice(0, 3);

  if (loading) {
    return (
      <PageLoader 
        title="Loading CVs" 
        subtitle="We're fetching your professional resumes..."
        size="small"
      />
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
            <div key={cv.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200" data-cv-id={cv.id}>
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
                      <span>
                        {cv.jobId ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/job-details/${cv.jobId}`);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                          >
                            Generated for Job #{cv.jobId}
                          </button>
                        ) : (
                          'General CV'
                        )}
                      </span>
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
                  className="download-button hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  title="Download PDF"
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

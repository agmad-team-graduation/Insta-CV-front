import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { FileText, Plus, Calendar, Edit, Trash2, ChevronLeft, ChevronRight, Layout, List, FileType, FileUp, User, Briefcase, Pencil } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';
import { Badge } from "@/common/components/ui/badge";
import CreateResumeDialog from '../components/CreateResumeDialog';
import { Input } from "@/common/components/ui/input";

const PAGE_SIZE = 9; // Show 9 resumes per page (3x3 grid)

// Helper function to count visible sections
const countActiveSections = (resume) => {
  let count = 0;
  
  // Summary section is counted if visible and has content
  if (!resume.summarySection.hidden && resume.summarySection.summary?.trim()) {
    count++;
  }
  
  // Education section is counted if visible and has items
  if (!resume.educationSection.hidden && resume.educationSection.items?.length > 0) {
    count++;
  }
  
  // Experience section is counted if visible and has items
  if (!resume.experienceSection.hidden && resume.experienceSection.items?.length > 0) {
    count++;
  }
  
  // Project section is counted if visible and has items
  if (!resume.projectSection.hidden && resume.projectSection.items?.length > 0) {
    count++;
  }
  
  // Skill section is counted if visible and has items
  if (!resume.skillSection.hidden && resume.skillSection.items?.length > 0) {
    count++;
  }
  
  return count;
};

// Helper function to get template display name
const getTemplateDisplayName = (templateName) => {
  const templateNames = {
    modern: 'Modern',
    classic: 'Classic',
    technical: 'Technical',
    minimal: 'Minimal',
    hunterGreen: 'Hunter Green',
    harvard: 'Harvard',
    atlanticBlue: 'Atlantic Blue'
  };
  return templateNames[templateName] || templateName;
};

// Helper function to format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const ResumesPage = () => {
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();

  // Calculate pagination values
  const totalPages = Math.ceil(allResumes.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  
  // Get current page's resumes
  const currentResumes = useMemo(() => {
    // Sort resumes by updatedAt in descending order (newest first)
    const sortedResumes = [...allResumes].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sortedResumes.slice(startIndex, endIndex);
  }, [allResumes, startIndex, endIndex]);

  useEffect(() => {
    fetchResumes();
  }, []); // Only fetch once since we have all data

  const fetchResumes = async () => {
    try {
      const response = await apiClient.get('/api/v1/cv/user');
      setAllResumes(response.data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  const handleCreateEmptyResume = async () => {
    try {
      const newResumeId = await createNewResume(true);
      setShowCreateDialog(false);
      navigate(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Error creating new resume:', error);
      toast.error('Failed to create new resume');
    }
  };

  const handleCreateFromProfile = async () => {
    try {
      const newResumeId = await createNewResume(false);
      setShowCreateDialog(false);
      navigate(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Error creating resume from profile:', error);
      toast.error('Failed to create resume from profile');
    }
  };

  const handleCreateForJob = () => {
    setShowCreateDialog(false);
    navigate('/jobs'); // Navigate to jobs page to select a job
  };

  const handleDelete = async (resumeId, e) => {
    e.stopPropagation();
    console.log("deleting resume", resumeId);
    try {
      await apiClient.delete(`/api/v1/cv/${resumeId}`);
      toast.success('Resume deleted successfully');
      // Update local state by removing the deleted resume
      setAllResumes(prev => prev.filter(resume => resume.id !== resumeId));
      // If we're on the last page and delete the last item, go to previous page
      if (currentResumes.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleTitleEdit = (resume) => {
    setEditingTitleId(resume.id);
    setEditingTitle(resume.cvTitle || `Resume #${resume.id}`);
  };

  const handleTitleSave = async (resumeId) => {
    try {
      const response = await apiClient.put(`/api/v1/cv/update-title?cvId=${resumeId}&title=${encodeURIComponent(editingTitle)}`);
      setAllResumes(prev => prev.map(resume => 
        resume.id === resumeId ? { ...resume, cvTitle: response.data.cvTitle } : resume
      ));
      setEditingTitleId(null);
      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  const handleTitleCancel = () => {
    setEditingTitleId(null);
    setEditingTitle('');
  };

  const handleTitleKeyDown = (e, resumeId) => {
    if (e.key === 'Enter') {
      handleTitleSave(resumeId);
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Resumes</h1>
        <Button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      <CreateResumeDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResumes.map((resume) => (
          <Card 
            key={resume.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={(e) => {
              // Don't navigate if clicking on the title edit input
              if (e.target.closest('.title-edit-container')) return;
              navigate(`/resumes/${resume.id}`);
            }}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingTitleId === resume.id ? (
                      <div className="title-edit-container" onClick={e => e.stopPropagation()}>
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleTitleKeyDown(e, resume.id)}
                          onBlur={() => handleTitleSave(resume.id)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <h3 className="font-mono font-medium text-gray-900 truncate">
                          {resume.cvTitle || `Resume #${resume.id}`}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTitleEdit(resume);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-600 ml-2 flex-shrink-0"
                  onClick={(e) => handleDelete(resume.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Summary Preview */}
              {resume.summarySection?.summary && !resume.summarySection.hidden && (
                <div className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {resume.summarySection.summary}
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Updated: {formatDateTime(resume.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  <span>
                    {countActiveSections(resume)} active sections
                  </span>
                </div>
                <div className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  <span>
                    {resume.jobId ? `Generated for Job #${resume.jobId}` : 'General CV'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {allResumes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resumes Yet</h3>
            <p className="text-gray-500 mb-4">Create your first resume to get started</p>
            <Button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1} 
            variant="outline" 
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages} 
            variant="outline" 
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumesPage; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/common/components/ui/button";
import { Card, CardContent } from "@/common/components/ui/card";
import { FileText, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';

const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await apiClient.get('/api/v1/cv/user');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newResumeId = await createNewResume();
      navigate(`/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Error creating new resume:', error);
    }
  };

  const handleDelete = async (resumeId, e) => {
    e.stopPropagation();
    console.log("deleting resume", resumeId);
    try {
      await apiClient.delete(`/api/v1/cv/${resumeId}`);
      toast.success('Resume deleted successfully');
      fetchResumes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card 
            key={resume.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/resumes/${resume.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">
                    {resume.personalDetails?.fullName || 'Untitled Resume'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-600"
                  onClick={(e) => handleDelete(resume.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {resume.jobId && (
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Generated for Job #{resume.jobId}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {resumes.length === 0 && (
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
    </div>
  );
};

export default ResumesPage; 
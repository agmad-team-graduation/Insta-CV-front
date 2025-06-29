import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { FileCode2, ExternalLink, CalendarIcon, Plus } from 'lucide-react';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';
import { ProjectItem } from '../types';

interface ProfileProject {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: { id: number; skill: string }[];
  present: boolean;
  url?: string;
}

interface ImportProjectsModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (project: Omit<ProjectItem, 'id' | 'orderIndex'>) => void;
}

const ImportProjectsModal: React.FC<ImportProjectsModalProps> = ({
  open,
  onClose,
  onImport
}) => {
  const [profileProjects, setProfileProjects] = useState<ProfileProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open) {
      fetchProfileProjects();
    }
  }, [open]);

  const fetchProfileProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/profiles/me');
      const projects = response.data.projects || [];
      setProfileProjects(projects);
    } catch (error) {
      console.error('Error fetching profile projects:', error);
      toast.error('Failed to load profile projects');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string, present: boolean) => {
    if (!startDate && !endDate) return '';
    
    const start = startDate ? formatDate(startDate) : '';
    const end = present ? 'Present' : (endDate ? formatDate(endDate) : '');
    
    if (start && end) {
      return `${start} – ${end}`;
    } else if (start) {
      return start;
    } else if (end) {
      return end;
    }
    return '';
  };

  const handleProjectToggle = (projectId: number) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleImportSelected = () => {
    selectedProjects.forEach(projectId => {
      const project = profileProjects.find(p => p.id === projectId);
      if (project) {
        const resumeProject: Omit<ProjectItem, 'id' | 'orderIndex'> = {
          title: project.title,
          startDate: project.startDate,
          endDate: project.endDate,
          description: project.description,
          skills: project.skills,
          present: project.present
        };
        onImport(resumeProject);
      }
    });
    
    toast.success(`Imported ${selectedProjects.size} project${selectedProjects.size !== 1 ? 's' : ''} from profile`);
    setSelectedProjects(new Set());
    onClose();
  };

  const handleImportSingle = (project: ProfileProject) => {
    const resumeProject: Omit<ProjectItem, 'id' | 'orderIndex'> = {
      title: project.title,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
      skills: project.skills,
      present: project.present
    };
    onImport(resumeProject);
    toast.success('Project imported from profile');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5" />
            Import Projects from Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading profile projects...</span>
          </div>
        ) : profileProjects.length === 0 ? (
          <div className="text-center py-8">
            <FileCode2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No projects found in your profile</p>
            <p className="text-sm text-gray-500">Add projects to your profile first, then come back to import them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedProjects.size} of {profileProjects.length} projects selected
              </p>
              {selectedProjects.size > 0 && (
                <Button onClick={handleImportSelected} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Import Selected ({selectedProjects.size})
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {profileProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProjects.has(project.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleProjectToggle(project.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          {project.url && (
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wide mb-3">
                          {formatDateRange(project.startDate, project.endDate, project.present) && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon size={12} />
                              {formatDateRange(project.startDate, project.endDate, project.present)}
                            </div>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        {project.skills && project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                              <Badge key={skill.id} variant="secondary" className="text-xs">
                                {skill.skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImportSingle(project);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Import
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportProjectsModal; 
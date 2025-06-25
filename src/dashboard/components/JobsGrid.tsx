import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Building, MapPin, Clock, Target, ExternalLink, Briefcase, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import useResumeStore from '@/features/resume-builder/store/resumeStore';
import apiClient from '@/common/utils/apiClient';

const response = await apiClient.get('/api/v1/jobs/all');
const jobs: Array<{
  id: string;
  title: string;
  company: string;
  location: string;
  posted: string;
  salary: string;
  matchPercentage: number;
  hardSkills: Array<{ id: string; skill: string }>;
  skillMatchingAnalysis: { matchedSkills: string[] };
}> = response.data.content;
console.log(jobs[0]);

const JobsGrid = () => {
  const navigate = useNavigate();
  const { generateCVForJob, isGenerating } = useResumeStore();
  const [generatingJobId, setGeneratingJobId] = useState<string | null>(null);

  const calculateMatchPercentage = (job: any) => {
    const totalSkills = job.hardSkills.length;
    const matchedSkills = job.skillMatchingAnalysis.matchedSkills.length;
    
    if (totalSkills === 0) return 0;
    
    return Math.round((matchedSkills / totalSkills) * 100);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleViewAll = () => {
    navigate('/jobs');
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleExternalLink = (jobId: string) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleGenerateTailoredCV = async (jobId: string) => {
    try {
      setGeneratingJobId(jobId);
      toast.info('Generating tailored CV for this job...');
      
      // Generate new CV for the specific job and get the resume ID
      const resumeId = await generateCVForJob(parseInt(jobId));
      
      // Navigate to the new resume's URL
      navigate(`/resumes/${resumeId}`);
      toast.success('Tailored CV generated successfully! You can now edit and customize it.');
    } catch (error) {
      console.error('Error generating tailored CV:', error);
      toast.error('Failed to generate tailored CV. Please try again.');
    } finally {
      setGeneratingJobId(null);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Saved Jobs</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAll}
            className="hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 transition-all"
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No saved jobs yet.</p>
            <Button 
              variant="link" 
              size="default"
              className="text-blue-600"
              onClick={() => navigate('/jobs')}
            >
              Add your first job
            </Button>
          </div>
        ) : (
          jobs.map((job) => {
            const matchPercentage = calculateMatchPercentage(job);
            return (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{job.salary}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-gray-500" />
                        <span className="text-sm font-medium">{matchPercentage}% Match</span>
                      </div>
                      <div className={`w-16 h-1 rounded-full mt-1 ${getMatchColor(matchPercentage)}`}></div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleExternalLink(job.id)}
                      className="hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 text-left">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.hardSkills.map((skillObj) => (
                      <Badge 
                        key={skillObj.id} 
                        variant={job.skillMatchingAnalysis.matchedSkills.includes(skillObj.skill) ? "default" : "secondary"}
                        className={`text-xs ${job.skillMatchingAnalysis.matchedSkills.includes(skillObj.skill) 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {skillObj.skill}
                        {job.skillMatchingAnalysis.matchedSkills.includes(skillObj.skill) && ' ✓'}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="default"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    onClick={() => handleGenerateTailoredCV(job.id)}
                    disabled={isGenerating || generatingJobId === job.id}
                  >
                    {isGenerating && generatingJobId === job.id ? (
                      <>
                        <Loader className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Tailored CV'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(job.id)}
                    className="hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 transition-all"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default JobsGrid;

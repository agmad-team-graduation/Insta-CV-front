import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { ChevronRight, ChevronLeft, Plus, CheckCircle, XCircle, Target, User, Loader2, Info } from 'lucide-react';
import { useParams } from 'react-router-dom';
import apiClient from '@/common/utils/apiClient';
import useResumeStore from '../store/resumeStore';
import { toast } from 'sonner';

interface JobSkill {
  skill: string;
  level?: string;
}

interface SkillMatchingAnalysis {
  matchedSkills: Array<{
    jobSkill: JobSkill;
    userSkill: JobSkill;
  }>;
  unmatchedJobSkills: JobSkill[];
  unmatchedUserSkills: JobSkill[];
}

interface JobData {
  id: number;
  title: string;
  company: string;
  hardSkills: JobSkill[];
  skillMatchingAnalysis: SkillMatchingAnalysis;
}

const JobSkillsComparison: React.FC = () => {
  const { id: resumeId } = useParams<{ id: string }>();
  const { resume, addItem } = useResumeStore();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingSkills, setAddingSkills] = useState<string[]>([]);
  const [addingAllSkills, setAddingAllSkills] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!resume?.jobId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let response;
        
        // Try regular job endpoint first
        try {
          response = await apiClient.get(`/api/v1/jobs/${resume.jobId}`);
        } catch (error) {
          // If regular job not found, try scrape endpoint
          console.log('Regular job not found, trying scraped job...');
          response = await apiClient.get(`/api/v1/jobs/scrape/${resume.jobId}`);
        }
        
        setJobData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job data:', err);
        setError('Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [resume?.jobId]);

  const handleSkillDoubleClick = async (skill: JobSkill) => {
    if (!resume || isSkillInResume(skill.skill) || addingSkills.includes(skill.skill)) return;

    try {
      setAddingSkills(prev => [...prev, skill.skill]);
      
      // Add the skill to the resume's skill section
      await addItem('skillSection', {
        skill: skill.skill,
        level: skill.level?.toUpperCase() || 'INTERMEDIATE' // Use specified level or default
      });

      toast.success(`Added "${skill.skill}" to your resume`);
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill to resume');
    } finally {
      setAddingSkills(prev => prev.filter(s => s !== skill.skill));
    }
  };

  const getCurrentResumeSkills = () => {
    return resume?.skillSection?.items?.map(item => item.skill.toLowerCase()) || [];
  };

  const isSkillInResume = (skillName: string) => {
    const currentSkills = getCurrentResumeSkills();
    return currentSkills.includes(skillName.toLowerCase());
  };

  // Calculate dynamic match score based on current resume skills
  const calculateDynamicMatchScore = () => {
    if (!jobData?.skillMatchingAnalysis) return { percentage: 0, matched: 0, total: 0 };
    
    const currentResumeSkills = getCurrentResumeSkills();
    const matchedSkills = jobData.skillMatchingAnalysis.matchedSkills || [];
    const missingSkills = jobData.skillMatchingAnalysis.unmatchedJobSkills || [];
    
    // Count how many matched skills are still in the resume
    const matchedSkillsInResume = matchedSkills.filter(match => 
      currentResumeSkills.includes(match.userSkill.skill.toLowerCase())
    ).length;
    
    // Count how many missing skills have been added to the resume
    const addedMissingSkills = missingSkills.filter(skill => 
      currentResumeSkills.includes(skill.skill.toLowerCase())
    ).length;
    
    // Total matched = matched skills still in resume + newly added missing skills
    const totalMatched = matchedSkillsInResume + addedMissingSkills;
    const totalSkills = matchedSkills.length + missingSkills.length;
    const percentage = totalSkills > 0 ? Math.round((totalMatched / totalSkills) * 100) : 0;
    
    return {
      percentage,
      matched: totalMatched,
      total: totalSkills
    };
  };

  // Get dynamic match data
  const dynamicMatch = calculateDynamicMatchScore();

  if (!resume?.jobId) {
    return null; // Don't show if resume is not for a specific job
  }

  if (loading) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors border-b border-gray-200"
          title={isExpanded ? 'Collapse Job Skills' : 'Expand Job Skills'}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 text-center text-gray-500">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-3">Unable to load job data</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/job-details/${resume?.jobId}`, '_blank')}
              className="text-xs"
            >
              View Job Details
            </Button>
          </div>
        )}
      </div>
    );
  }

  const matchedSkillsCount = jobData.skillMatchingAnalysis?.matchedSkills?.length || 0;
  const unmatchedSkillsCount = jobData.skillMatchingAnalysis?.unmatchedJobSkills?.length || 0;
  const unmatchedUserSkillsCount = jobData.skillMatchingAnalysis?.unmatchedUserSkills?.length || 0;
  const totalSkillsCount = matchedSkillsCount + unmatchedSkillsCount;
  const matchPercentage = totalSkillsCount > 0 ? Math.round((matchedSkillsCount / totalSkillsCount) * 100) : 0;

  // Check if we have valid skill matching data
  const hasSkillMatchingData = jobData.skillMatchingAnalysis && 
    (jobData.skillMatchingAnalysis.matchedSkills?.length > 0 || 
     jobData.skillMatchingAnalysis.unmatchedJobSkills?.length > 0 ||
     jobData.skillMatchingAnalysis.unmatchedUserSkills?.length > 0);

  if (!hasSkillMatchingData) {
    return (
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors border-b border-gray-200"
          title={isExpanded ? 'Collapse Job Skills' : 'Expand Job Skills'}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 text-center text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No skill matching data available for this job</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
      isExpanded ? 'w-80' : 'w-16'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors border-b border-gray-200"
        title={isExpanded ? 'Collapse Job Skills' : 'Expand Job Skills'}
      >
        {isExpanded ? (
          <ChevronRight className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-blue-600" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Job Info Header */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-1">{jobData.title}</h3>
            <p className="text-sm text-gray-600">@ {jobData.company}</p>
            <Badge variant="outline" className="mt-2">
              Job #{jobData.id}
            </Badge>
          </div>

          {/* Skill Match Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Skill Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Match Percentage */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dynamicMatch.percentage}%</div>
                <div className="text-sm text-gray-600">Skills Match</div>
                {dynamicMatch.percentage !== matchPercentage && (
                  <div className={`text-xs mt-1 ${
                    dynamicMatch.percentage > matchPercentage ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dynamicMatch.percentage > matchPercentage ? '↗' : '↘'} {Math.abs(dynamicMatch.percentage - matchPercentage)}% change
                  </div>
                )}
              </div>

              {/* Match Stats */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{dynamicMatch.matched} Matched</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>{dynamicMatch.total - dynamicMatch.matched} Missing</span>
                </div>
              </div>
              
              {/* Additional Stats */}
              {unmatchedUserSkillsCount > 0 && (
                <div className="flex justify-center text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>{unmatchedUserSkillsCount} Other Skills Available</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matched Skills */}
          {jobData.skillMatchingAnalysis?.matchedSkills?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Matched Skills
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const matchedSkills = jobData.skillMatchingAnalysis?.matchedSkills?.filter(match => 
                          !isSkillInResume(match.userSkill.skill)
                        ) || [];
                        
                        for (const match of matchedSkills) {
                          await addItem('skillSection', {
                            skill: match.userSkill.skill,
                            level: match.userSkill.level?.toUpperCase() || 'INTERMEDIATE'
                          });
                        }
                        
                        if (matchedSkills.length > 0) {
                          toast.success(`Added ${matchedSkills.length} matched skills to your resume`);
                        } else {
                          toast.info('No matched skills to add');
                        }
                      } catch (error) {
                        console.error('Error adding matched skills:', error);
                        toast.error('Failed to add some skills');
                      }
                    }}
                    disabled={addingAllSkills}
                    className="h-6 w-6 p-0"
                    title="Add all matched skills"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobData.skillMatchingAnalysis.matchedSkills.map((match, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className={`cursor-pointer transition-all duration-200 hover:bg-green-100 hover:text-green-800 ${
                        isSkillInResume(match.userSkill.skill) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      } ${
                        addingSkills.includes(match.userSkill.skill) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onDoubleClick={() => handleSkillDoubleClick(match.userSkill)}
                      title={isSkillInResume(match.userSkill.skill) ? 'Already in resume' : 'Double-click to add'}
                    >
                      {match.userSkill.skill}
                      {addingSkills.includes(match.userSkill.skill) && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Skills */}
          {jobData.skillMatchingAnalysis?.unmatchedJobSkills?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    Missing Skills
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const missingJobSkills = jobData.skillMatchingAnalysis?.unmatchedJobSkills?.filter(skill => 
                          !isSkillInResume(skill.skill)
                        ) || [];
                        
                        for (const skill of missingJobSkills) {
                          await addItem('skillSection', {
                            skill: skill.skill,
                            level: skill.level?.toUpperCase() || 'INTERMEDIATE'
                          });
                        }
                        
                        if (missingJobSkills.length > 0) {
                          toast.success(`Added ${missingJobSkills.length} missing skills to your resume`);
                        } else {
                          toast.info('No missing skills to add');
                        }
                      } catch (error) {
                        console.error('Error adding missing skills:', error);
                        toast.error('Failed to add some skills');
                      }
                    }}
                    disabled={addingAllSkills}
                    className="h-6 w-6 p-0"
                    title="Add all missing skills"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobData.skillMatchingAnalysis.unmatchedJobSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className={`cursor-pointer transition-all duration-200 hover:bg-red-100 hover:text-red-800 ${
                        isSkillInResume(skill.skill) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      } ${
                        addingSkills.includes(skill.skill) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onDoubleClick={() => handleSkillDoubleClick(skill)}
                      title={isSkillInResume(skill.skill) ? 'Already in resume' : 'Double-click to add'}
                    >
                      {skill.skill}
                      {addingSkills.includes(skill.skill) && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Your Other Skills (Unmatched User Skills) */}
          {jobData.skillMatchingAnalysis?.unmatchedUserSkills?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                    <User className="h-5 w-5" />
                    Your Other Skills
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const unmatchedUserSkills = jobData.skillMatchingAnalysis?.unmatchedUserSkills?.filter(skill => 
                          !isSkillInResume(skill.skill)
                        ) || [];
                        
                        for (const skill of unmatchedUserSkills) {
                          await addItem('skillSection', {
                            skill: skill.skill,
                            level: skill.level?.toUpperCase() || 'INTERMEDIATE'
                          });
                        }
                        
                        if (unmatchedUserSkills.length > 0) {
                          toast.success(`Added ${unmatchedUserSkills.length} other skills to your resume`);
                        } else {
                          toast.info('No other skills to add');
                        }
                      } catch (error) {
                        console.error('Error adding other skills:', error);
                        toast.error('Failed to add some skills');
                      }
                    }}
                    disabled={addingAllSkills}
                    className="h-6 w-6 p-0"
                    title="Add all other skills"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobData.skillMatchingAnalysis.unmatchedUserSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className={`cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 ${
                        isSkillInResume(skill.skill) 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      } ${
                        addingSkills.includes(skill.skill) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onDoubleClick={() => handleSkillDoubleClick(skill)}
                      title={isSkillInResume(skill.skill) ? 'Already in resume' : 'Double-click to add'}
                    >
                      {skill.skill}
                      {addingSkills.includes(skill.skill) && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSkillsComparison; 
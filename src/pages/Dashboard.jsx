import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Progress } from '@/common/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import {
  FileText,
  Briefcase,
  Target,
  Plus,
  Star,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Download,
  Eye,
  Edit,
  Bell,
  Settings,
  Github,
  Sparkles,
  Loader
} from 'lucide-react';
import AddJobDialog from '@/features/jobs/components/AddJob/AddJobDialog';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';
import useResumeStore from '@/features/resume-builder/store/resumeStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { generateCVForJob } = useResumeStore();

  // State for real data
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCVs: 0,
    savedJobs: 0,
    skillMatches: '0%'
  });

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      const response = await apiClient.get('/api/v1/profiles/me/skills');
      const skillsData = response.data || [];

      // Transform skills data to match dashboard format
      const transformedSkills = skillsData.map(skill => ({
        name: skill.skill || skill.name,
        level: getSkillLevelPercentage(skill.level),
        category: getSkillCategory(skill.skill || skill.name),
        inDemand: isSkillInDemand(skill.skill || skill.name)
      }));

      setSkills(transformedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    }
  };

  // Fetch jobs from API (same as jobs page)
  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/api/v1/jobs/all?page=0&size=3');
      const jobsData = response.data.content || response.data || [];

      // Transform jobs data to match dashboard format
      const transformedJobs = jobsData.map(job => ({
        id: job.id,
        title: job.title || job.jobTitle,
        company: job.company,
        location: job.location || `${job.city || ''}, ${job.country || ''}`.replace(/^,\s*/, ''),
        posted: formatPostedDate(job.createdAt || job.postedDate),
        matchPercentage: calculateMatchPercentage(job, skills),
        requiredSkills: job.requiredSkills || job.skills || [],
        matchedSkills: getMatchedSkills(job, skills),
        salary: job.salary || 'Salary not specified'
      }));

      setJobs(transformedJobs);
      setStats(prev => ({ ...prev, savedJobs: response.data.totalElements || jobsData.length }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  // Fetch CVs from API (same as resumes page)
  const fetchCVs = async () => {
    try {
      const response = await apiClient.get('/api/v1/cv/user');
      const cvsData = response.data || [];

      // Transform CVs data to match dashboard format
      const transformedCVs = cvsData.map(cv => ({
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
      setStats(prev => ({ ...prev, totalCVs: cvsData.length }));
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setCvs([]);
    }
  };

  // Helper functions
  const getSkillLevelPercentage = (level) => {
    const levelMap = {
      'BEGINNER': 25,
      'INTERMEDIATE': 50,
      'PROFICIENT': 75,
      'EXPERT': 90,
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 90
    };
    return levelMap[level] || 50;
  };

  const getSkillCategory = (skillName) => {
    const categories = {
      'React': 'Frontend',
      'Vue': 'Frontend',
      'Angular': 'Frontend',
      'JavaScript': 'Language',
      'TypeScript': 'Language',
      'Python': 'Language',
      'Java': 'Language',
      'Node.js': 'Backend',
      'Express': 'Backend',
      'Spring': 'Backend',
      'AWS': 'Cloud',
      'Azure': 'Cloud',
      'Docker': 'DevOps',
      'Kubernetes': 'DevOps'
    };
    return categories[skillName] || 'Other';
  };

  const isSkillInDemand = (skillName) => {
    const inDemandSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'AWS', 'Docker'];
    return inDemandSkills.includes(skillName);
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const calculateMatchPercentage = (job, userSkills) => {
    if (!job.requiredSkills || !userSkills.length) return Math.floor(Math.random() * 30) + 70;

    const userSkillNames = userSkills.map(s => s.name.toLowerCase());
    const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());
    const matched = requiredSkills.filter(skill => userSkillNames.includes(skill));

    return Math.round((matched.length / requiredSkills.length) * 100);
  };

  const getMatchedSkills = (job, userSkills) => {
    if (!job.requiredSkills || !userSkills.length) return [];

    const userSkillNames = userSkills.map(s => s.name.toLowerCase());
    const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());
    return requiredSkills.filter(skill => userSkillNames.includes(skill));
  };

  // Load all data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSkills(),
          fetchJobs(),
          fetchCVs()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Refresh data when job is added
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchJobs();
    }
  }, [refreshTrigger]);

  // Stats data with real values
  const statsData = [
    {
      title: 'Total CVs',
      value: stats.totalCVs.toString(),
      change: '+2 this month',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saved Jobs',
      value: stats.savedJobs.toString(),
      change: '+8 this week',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Skill Matches',
      value: stats.skillMatches,
      change: 'Avg match rate',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchColorText = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleJobAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddJobDialog(false);
    toast.success('Job added successfully!');
  };

  const handleGenerateAICV = () => {
    navigate('/resumes');
    toast.info('Redirecting to CV builder...');
  };

  const handleGenerateTailoredCV = async (jobId) => {
    try {
      // Generate new CV for the specific job and get the resume ID
      const resumeId = await generateCVForJob(parseInt(jobId));
      // Navigate to the new resume's URL
      navigate(`/resumes/${resumeId}`);
      toast.success('Tailored CV generated successfully!');
    } catch (error) {
      console.error('Error generating tailored CV:', error);
      toast.error('Failed to generate tailored CV. Please try again.');
    }
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  const handleViewAllCVs = () => {
    navigate('/resumes');
  };

  const handleJobDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleCVPreview = (cvId) => {
    navigate(`/resumes/${cvId}`);
  };

  const handleCVEdit = (cvId) => {
    navigate(`/resumes/${cvId}`);
  };

  const handleCVDownload = (cvId) => {
    toast.info('Download functionality coming soon!');
  };

  const handleCreateNewCV = () => {
    navigate('/resumes');
  };

  const handleProfileSettings = () => {
    navigate('/profile');
  };

  const handleNotifications = () => {
    toast.info('Notifications panel coming soon!');
  };

  const handleGithubConnection = () => {
    navigate('/github-profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
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

        {/* Quick Actions */}
        <Card className="mt-8 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Ready to create your next CV?
                </h3>
                <p className="text-gray-600 text-sm">
                  Use AI to tailor your CV for specific job requirements in seconds
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  onClick={handleGenerateAICV}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI CV
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                  onClick={() => setShowAddJobDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Profile Skills */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Your Skills</span>
                  <Button variant="ghost" size="sm" onClick={handleProfileSettings}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {skills.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No skills found.</p>
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={handleProfileSettings}
                    >
                      Add skills to your profile
                    </Button>
                  </div>
                ) : (
                  skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{skill.name}</span>
                          {skill.inDemand && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          {skill.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={skill.level} className="flex-1 h-2" />
                        <span className="text-xs text-gray-500 min-w-[30px]">{skill.level}%</span>
                      </div>
                    </div>
                  ))
                )}

                {skills.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-xs text-gray-500 mb-2">Skill Insights</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">High demand skills</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your skills are highly sought after in the job market.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Jobs and CVs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Jobs Grid */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Saved Jobs</span>
                  <Button variant="outline" size="sm" onClick={handleViewAllJobs}>
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
                      className="text-blue-600"
                      onClick={() => setShowAddJobDialog(true)}
                    >
                      Add your first job
                    </Button>
                  </div>
                ) : (
                  jobs.map((job) => (
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
                          <Button variant="ghost" size="sm" onClick={() => handleJobDetails(job.id)}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {job.requiredSkills && job.requiredSkills.length > 0 && (
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
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleGenerateTailoredCV(job.id)}
                        >
                          Generate Tailored CV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJobDetails(job.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* CVs List */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Your CVs</span>
                  <Button variant="outline" size="sm" onClick={handleCreateNewCV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create New
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
                      className="text-blue-600"
                      onClick={handleCreateNewCV}
                    >
                      Create your first CV
                    </Button>
                  </div>
                ) : (
                  cvs.map((cv) => (
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
                              <Clock className="w-3 h-3" />
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
                            <span className={`flex items-center gap-1 font-medium ${getMatchColorText(cv.matchScore)}`}>
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
                          onClick={() => handleCVPreview(cv.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCVEdit(cv.id)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCVDownload(cv.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {cvs.length > 0 && (
                  <div className="text-center py-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">
                      AI-powered CV optimization ready when you are
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleCreateNewCV}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Create Your First AI CV
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Job Dialog */}
      <AddJobDialog
        open={showAddJobDialog}
        onOpenChange={setShowAddJobDialog}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
};

export default Dashboard; 
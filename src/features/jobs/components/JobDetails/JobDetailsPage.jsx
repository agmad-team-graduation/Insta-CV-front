import { Button } from "@/common/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import apiClient from "@/common/utils/apiClient";
import useResumeStore from "@/features/resume-builder/store/resumeStore";
import PageLoader from "@/common/components/ui/PageLoader";

// Import the new modular components
import JobHeader from "./JobHeader";
import JobDescription from "./JobDescription";
import SkillsSection from "./SkillsSection";
import ActionButtons from "./ActionButtons";
import SkillsMatching from "./SkillsMatching";
import SimilarJobs from "./SimilarJobs";

function JobDetailsPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const { jobID } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['isLoggedIn']);
  const token = cookies.isLoggedIn || '';
  const [isExternal, setIsExternal] = useState(false);
  const { generateCVForJob } = useResumeStore();

  // Helper function to generate company initials
  const generateCompanyInitials = (companyName) => {
    if (!companyName) return 'IC'; // Fallback to InstaCV initials
    
    const words = companyName.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word: take first two letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of first two words
      return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
    }
  };

  const fetchJobDetails = async (forceAnalyze = false) => {
    try {
      setLoading(true);
      // Try regular job endpoint first
      let response;
      try {
        const url = forceAnalyze 
          ? `/api/v1/jobs/${jobID}?forceAnalyze=true`
          : `/api/v1/jobs/${jobID}`;
        response = await apiClient.get(url);
        setIsExternal(false);
      } catch (error) {
        // If regular job not found, try scrape endpoint
        const url = forceAnalyze 
          ? `/api/v1/jobs/scrape/${jobID}?forceAnalyze=true`
          : `/api/v1/jobs/scrape/${jobID}`;
        response = await apiClient.get(url);
        setIsExternal(true);
      }
      setJob(response.data);
    } catch (error) {
      // console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      await fetchJobDetails(true); // Pass true to force reanalysis
    } catch (error) {
      console.error("Error reanalyzing job:", error);
    } finally {
      setIsReanalyzing(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    
    const fetchRecommendations = async () => {
      try {
        const recResponse = await apiClient.get('/api/v1/jobs/scrape/get-recommendations');
        if (Array.isArray(recResponse.data)) {
          setRecommendations(recResponse.data);
        } else if (recResponse.data && Array.isArray(recResponse.data.content)) {
          setRecommendations(recResponse.data.content);
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [jobID]);

  const handleGenerateCV = async () => {
    setIsGeneratingCV(true);
    try {
      // Generate new CV and get the resume ID
      const resumeId = await generateCVForJob(parseInt(jobID));
      // Navigate to the new resume's URL
      navigate(`/resumes/${resumeId}`);
    } catch (error) {
      console.error('Error generating CV:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleInterviewQuestions = () => {
    navigate(`/interview-questions/${jobID}`);
  };

  const handleApply = () => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    }
  };

  const handleSimilarJobClick = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Job Details" 
        subtitle="We're analyzing this job opportunity for you..."
      />
    );
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Job not found</div>;
  }

  // Calculate skill match percentage
  const matchedSkillsCount = job.skillMatchingAnalysis.matchedSkills?.length || 0;
  const unmatchedSkillsCount = job.skillMatchingAnalysis.unmatchedJobSkills?.length || 0;
  const totalSkillsCount = matchedSkillsCount + unmatchedSkillsCount;
  const matchPercentage = totalSkillsCount > 0 ? Math.round((matchedSkillsCount / totalSkillsCount) * 100) : 0;

  // Extract matched and missing skills
  const matchedSkills = job.skillMatchingAnalysis.matchedSkills?.map(skill => skill.jobSkill.skill) || [];
  const missingSkills = job.skillMatchingAnalysis.unmatchedJobSkills?.map(skill => skill.skill) || [];

  // Generate company initials for the header
  const companyInitials = generateCompanyInitials(job.company);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-mono">Job ID: #{jobID}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{companyInitials}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <JobHeader
          title={job.title}
          company={job.company}
          location={job.location}
          salary={job.salary}
          type={job.type}
          postedDate={job.postedDate}
        />

        {/* Job Description */}
        <JobDescription
          description={job.description}
          requirements={job.requirements}
          responsibilities={job.responsibilities}
        />

        {/* Required Skills */}
        {job.hardSkills && job.hardSkills.length > 0 && (
          <SkillsSection requiredSkills={job.hardSkills} />
        )}

        {/* Action Buttons */}
        <ActionButtons
          onGenerateCV={handleGenerateCV}
          onInterviewQuestions={handleInterviewQuestions}
          onReanalyze={handleReanalyze}
          onApply={handleApply}
          isGeneratingCV={isGeneratingCV}
          isReanalyzing={isReanalyzing}
          isExternal={isExternal}
          applyUrl={job.applyUrl}
        />

        {/* Skills Matching */}
        <SkillsMatching
          matchedSkills={matchedSkills}
          missingSkills={missingSkills}
          matchPercentage={matchPercentage}
        />

        {/* Similar Jobs */}
        <SimilarJobs
          jobs={recommendations}
          onJobClick={handleSimilarJobClick}
          currentJobId={parseInt(jobID)}
        />
      </main>
    </div>
  );
}

export default JobDetailsPage;
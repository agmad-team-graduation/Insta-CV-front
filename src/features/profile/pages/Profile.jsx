import React, { useState, useEffect, useCallback } from "react";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SkillsSection from "@/features/profile/components/SkillSection";
import EducationSection from "@/features/profile/components/EducationSection";
import ExperienceSection from "@/features/profile/components/ExperienceSection";
import apiClient from "@/common/utils/apiClient";
import { Button } from "@/common/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/common/components/ui/card";
import ProjectSection from "@/features/profile/components/ProjectSection";
import PersonalDetailsSection from "@/features/profile/components/PersonalDetailsSection";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/common/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useBlocker } from "../../../useBlocker";
import { Upload, Loader2 } from "lucide-react";
import PageLoader from "@/common/components/ui/PageLoader";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadingCV, setUploadingCV] = useState(false);
  const [selectedCVFile, setSelectedCVFile] = useState(null);
  const [showCVUploadDialog, setShowCVUploadDialog] = useState(false);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/v1/profiles/me");
        setProfileData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedData) => {
    try {
      setSaving(true);
      // Prepare the data to be sent to the backend
      const dataToSave = {
        profileId: updatedData.profileId,
        personalDetails: updatedData.personalDetails,
        educationList: updatedData.educationList,
        experienceList: updatedData.experienceList,
        userSkills: updatedData.userSkills.map(skill => ({
          ...skill,
          level: skill.level ? skill.level.toUpperCase() : skill.level
        })),
        projects: updatedData.projects
      };
      
      // Send the PUT request
      await apiClient.put("/api/v1/profiles/update", dataToSave);
      
      // Show success message
      setHasUnsavedChanges(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile data:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Block navigation if there are unsaved changes
  useBlocker((tx) => {
    if (hasUnsavedChanges) {
      setShowLeaveModal(true);
      setLastTx(tx);
    } else {
      tx.retry();
    }
  }, hasUnsavedChanges);

  // Modal actions
  const handleSaveAndLeave = async () => {
    await handleSaveProfile(profileData);
    setHasUnsavedChanges(false);
    setShowLeaveModal(false);
    setPendingNavigation(lastTx);
  };

  const handleLeaveWithoutSaving = () => {
    setHasUnsavedChanges(false);
    setShowLeaveModal(false);
    setPendingNavigation(lastTx);
  };

  // Effect to retry navigation after unsaved changes are cleared
  useEffect(() => {
    if (!hasUnsavedChanges && pendingNavigation) {
      pendingNavigation.retry();
      setPendingNavigation(null);
    }
  }, [hasUnsavedChanges, pendingNavigation]);

  // Warn on browser/tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setPhotoUrl(newPhotoUrl);
  };

  const handleCVFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    setSelectedCVFile(file);
    setShowCVUploadDialog(true);
  };

  const handleCVUpload = async (shouldOverwrite) => {
    if (!selectedCVFile) return;

    // Close dialog immediately when user makes a choice
    setShowCVUploadDialog(false);

    try {
      setUploadingCV(true);
      setShowUploadProgress(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', selectedCVFile);

      // Start progress simulation immediately
      const startTime = Date.now();
      const maxDuration = 20000; // 20 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / maxDuration) * 100, 95); // Cap at 95% until response
        setUploadProgress(progress);
      }, 100);

      const response = await apiClient.post(`/api/v1/profiles/upload-cv?overwrite=${shouldOverwrite}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(async () => {
        // Refresh profile data after successful upload
        const profileResponse = await apiClient.get("/api/v1/profiles/me");
        setProfileData(profileResponse.data);
        
        toast.success('CV uploaded successfully! Profile updated.');
        setShowUploadProgress(false);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV. Please try again.');
      setShowUploadProgress(false);
    } finally {
      setUploadingCV(false);
      setSelectedCVFile(null);
    }
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Profile" 
        subtitle="We're fetching your professional information..."
      />
    );
  }

  if (error) {
    return <div className="container mx-auto py-6 px-4 text-center text-red-500">{error}</div>;
  }

  // Map skills to the format expected by OtherSkills component
  const mappedSkills = profileData?.userSkills?.map(skill => ({
    id: skill.id || `skill-${skill.skill.replace(/\s+/g, '-').toLowerCase()}`,
    name: skill.skill,
    level: skill.level ?? ''
  })) || [];

  // Map experiences to the format expected by ExperienceSection component
  const mappedExperiences = profileData?.experienceList?.map(exp => {
    // Handle location construction - only show non-empty values and avoid extra commas
    const locationParts = [];
    if (exp.city && exp.city.trim()) locationParts.push(exp.city.trim());
    if (exp.country && exp.country.trim()) locationParts.push(exp.country.trim());
    const location = locationParts.length > 0 ? locationParts.join(', ') : '';

    // Handle experience duration - only show dates if both are provided
    const hasStartDate = exp.startDate && exp.startDate.trim();
    const hasEndDate = exp.endDate && exp.endDate.trim();
    const isPresent = exp.present;
    
    let durationText = '';
    if (hasStartDate && (hasEndDate || isPresent)) {
      const startDate = formatDate(exp.startDate);
      const endDate = isPresent ? "Present" : formatDate(exp.endDate);
      durationText = `${startDate} - ${endDate}`;
    } else if (hasStartDate) {
      durationText = formatDate(exp.startDate);
    } else if (hasEndDate) {
      durationText = formatDate(exp.endDate);
    }

    return {
      companyLogo: "https://via.placeholder.com/40", // Placeholder until you have actual logos
      position: exp.jobTitle,
      city: exp.city,
      country: exp.country,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      present: exp.present,
      location: location,
      description: exp.description,
      duration: {
        startDate: hasStartDate ? formatDate(exp.startDate) : '',
        endDate: isPresent ? "Present" : (hasEndDate ? formatDate(exp.endDate) : ''),
        displayText: durationText
      },
      months: calculateMonths(exp.startDate, exp.endDate, exp.present),
      responsibilities: [exp.description],
      techStack: [] // Add tech stack if available in your data
    };
  }) || [];

  // Map educations to the format expected by EducationSection component
  const mappedEducations = profileData?.educationList?.map(edu => {
    // Handle education duration - only show dates if both are provided
    const hasStartDate = edu.startDate && edu.startDate.trim();
    const hasEndDate = edu.endDate && edu.endDate.trim();
    const isPresent = edu.present;
    
    let durationText = '';
    if (hasStartDate && (hasEndDate || isPresent)) {
      const startDate = formatDate(edu.startDate);
      const endDate = isPresent ? "Present" : formatDate(edu.endDate);
      durationText = `${startDate} - ${endDate}`;
    } else if (hasStartDate) {
      durationText = formatDate(edu.startDate);
    } else if (hasEndDate) {
      durationText = formatDate(edu.endDate);
    }

    return {
      ...edu,
      duration: {
        startDate: hasStartDate ? formatDate(edu.startDate) : '',
        endDate: isPresent ? "Present" : (hasEndDate ? formatDate(edu.endDate) : ''),
        displayText: durationText
      }
    };
  }) || [];

  // Map projects to the format expected by ProjectSection component
  const mappedProjects = profileData?.projects?.map(project => {
    // Handle project duration - only show dates if both are provided
    const hasStartDate = project.startDate && project.startDate.trim();
    const hasEndDate = project.endDate && project.endDate.trim();
    const isPresent = project.present;
    
    let durationText = '';
    if (hasStartDate && (hasEndDate || isPresent)) {
      const startDate = formatDate(project.startDate);
      const endDate = isPresent ? "Present" : formatDate(project.endDate);
      durationText = `${startDate} - ${endDate}`;
    } else if (hasStartDate) {
      durationText = formatDate(project.startDate);
    } else if (hasEndDate) {
      durationText = formatDate(project.endDate);
    }

    return {
      ...project,
      duration: {
        startDate: hasStartDate ? formatDate(project.startDate) : '',
        endDate: isPresent ? "Present" : (hasEndDate ? formatDate(project.endDate) : ''),
        displayText: durationText
      },
      // Optionally map skills if needed
      skills: project.skills?.map(skill => ({
        id: skill.id,
        skill: skill.skill
      })) || []
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="mb-6 md:mb-8">
          <ProfileHeader 
            profileData={profileData} 
            onProfileUpdate={handleSaveProfile}
            onPhotoUpdate={handlePhotoUpdate}
            photoUrl={photoUrl}
          />
        </div>

        {/* CV Upload Section */}
        <div className="mb-6 md:mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Upload className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Upload Your CV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Upload your existing CV to extract and populate your profile automatically. Supports PDF format only.
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVFileSelect}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-base"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose CV File
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <PersonalDetailsSection 
              profileData={profileData} 
              onProfileUpdate={handleSaveProfile}
            />
            <SkillsSection 
              profileData={profileData} 
              onProfileUpdate={handleSaveProfile}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-6">
            <EducationSection 
              profileData={profileData} 
              onProfileUpdate={handleSaveProfile}
            />
            <ExperienceSection 
              profileData={profileData} 
              onProfileUpdate={handleSaveProfile}
            />
            <ProjectSection 
              profileData={profileData} 
              onProfileUpdate={handleSaveProfile}
            />
          </div>
        </div>

        {/* Save Button */}
        {hasUnsavedChanges && (
          <div className="sticky bottom-4 mt-8 flex justify-center">
            <Button
              onClick={() => handleSaveProfile(profileData)}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs remain the same */}
      {/* ... existing dialog code ... */}
    </div>
  );
};

// Helper function to format dates from ISO format to "MMM YYYY"
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper function to calculate months between dates
const calculateMonths = (startDate, endDate, present) => {
  if (!startDate) return 0;
  
  const start = new Date(startDate);
  const end = present ? new Date() : new Date(endDate || new Date());
  
  return (end.getFullYear() - start.getFullYear()) * 12 + 
         (end.getMonth() - start.getMonth());
};

export default Profile;

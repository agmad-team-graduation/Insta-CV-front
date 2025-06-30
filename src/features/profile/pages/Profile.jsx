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
    <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
      {profileData && (
        <>
          <Card className="mb-6">
            <CardContent>
              <ProfileHeader
                name={profileData.personalDetails?.fullName || ""}
                title={profileData.personalDetails?.jobTitle || ""}
                avatar={photoUrl}
                country={profileData.personalDetails?.address?.split(", ")[2] || ""}
                email={profileData.personalDetails?.email || ""}
                phone={profileData.personalDetails?.phone || ""}
                location={profileData.personalDetails?.address || ""}
                jobTitle={profileData.personalDetails?.jobTitle || ""}
                onPhotoUpdate={handlePhotoUpdate}
              />
              <div className="flex mt-2 justify-end">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf"
                  onChange={handleCVFileSelect}
                  style={{ display: 'none' }}
                  disabled={uploadingCV}
                />
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm"
                  disabled={uploadingCV}
                  onClick={() => document.getElementById('cv-upload').click()}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingCV ? 'Uploading...' : 'Upload CV'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardContent>
              <PersonalDetailsSection
                name={profileData.personalDetails?.fullName || ""}
                email={profileData.personalDetails?.email || ""}
                phone={profileData.personalDetails?.phone || ""}
                jobTitle={profileData.personalDetails?.jobTitle || ""}
                location={profileData.personalDetails?.address || ""}
                about={profileData.personalDetails?.about || ""}
                isEditMode={true}
                onUpdate={async updated => {
                  const newData = {
                    ...profileData,
                    personalDetails: {
                      ...profileData.personalDetails,
                      fullName: updated.name,
                      email: updated.email,
                      phone: updated.phone,
                      jobTitle: updated.jobTitle,
                      address: updated.location,
                      about: updated.about
                    }
                  };
                  setProfileData(newData);
                  await handleSaveProfile(newData);
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Skills Section */}
      <div className="mb-6">
        <SkillsSection 
          data={mappedSkills}
          isEditMode={true}
          onUpdate={async updatedSkills => {
            const newData = {
              ...profileData,
              userSkills: updatedSkills.map(skill => ({
                id: skill.id,
                skill: skill.name,
                level: skill.level?.toUpperCase()
              }))
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
        />
      </div>
      
      {/* Experience Section */}
      <div className="mb-6">
        <ExperienceSection 
          experiences={mappedExperiences}
          onAdd={async newExp => {
            const newData = {
              ...profileData,
              experienceList: [...profileData.experienceList, newExp]
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onDelete={async index => {
            const newData = {
              ...profileData,
              experienceList: profileData.experienceList.filter((_, i) => i !== index)
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onEdit={async (index, updatedExp) => {
            const newData = {
              ...profileData,
              experienceList: profileData.experienceList.map((exp, i) => 
                i === index ? { ...exp, ...updatedExp } : exp
              )
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
        />
      </div>
      
      {/* Education Section */}
      <div className="mb-6">
        <EducationSection
          educations={mappedEducations}
          onAdd={async newEdu => {
            const newData = {
              ...profileData,
              educationList: [...profileData.educationList, newEdu]
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onDelete={async index => {
            const newData = {
              ...profileData,
              educationList: profileData.educationList.filter((_, i) => i !== index)
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onEdit={async (index, updatedEdu) => {
            const newData = {
              ...profileData,
              educationList: profileData.educationList.map((edu, i) => 
                i === index ? { ...edu, ...updatedEdu } : edu
              )
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
        />
      </div>

      {/* Projects Section */}
      <div className="mb-6">
        <ProjectSection 
          projects={mappedProjects}
          onAdd={async newProj => {
            const newData = {
              ...profileData,
              projects: [...profileData.projects, newProj]
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onDelete={async index => {
            const newData = {
              ...profileData,
              projects: profileData.projects.filter((_, i) => i !== index)
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
          onEdit={async (index, updatedProj) => {
            const newData = {
              ...profileData,
              projects: profileData.projects.map((proj, i) => 
                i === index ? { ...proj, ...updatedProj } : proj
              )
            };
            setProfileData(newData);
            await handleSaveProfile(newData);
          }}
        />
      </div>

      {/* CV Upload Dialog */}
      <Dialog open={showCVUploadDialog} onOpenChange={setShowCVUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CV</DialogTitle>
            <DialogDescription>
              How would you like to process the uploaded CV?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleCVUpload(false)}
              disabled={uploadingCV}
            >
              Add to Current Profile
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleCVUpload(true)}
              disabled={uploadingCV}
            >
              Overwrite Current Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV Upload Progress Modal */}
      <Dialog open={showUploadProgress} onOpenChange={(open) => {
        if (!open) {
          setShowUploadProgress(false);
        }
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
            
            {/* Content */}
            <div className="relative p-8">
              <div className="text-center">
                {/* Animated Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Processing Your CV
                </h3>
                <p className="text-gray-600 mb-6">
                  We're analyzing your CV and extracting your professional information...
                </p>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                
                {/* Status Messages */}
                <div className="mt-6 text-sm text-gray-500">
                  {uploadProgress < 30 && "Uploading CV file..."}
                  {uploadProgress >= 30 && uploadProgress < 60 && "Parsing document content..."}
                  {uploadProgress >= 60 && uploadProgress < 90 && "Extracting professional information..."}
                  {uploadProgress >= 90 && uploadProgress < 100 && "Finalizing your profile..."}
                  {uploadProgress >= 100 && "Profile updated successfully!"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSaveAndLeave}>Save Profile</Button>
            <Button variant="outline" onClick={handleLeaveWithoutSaving}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

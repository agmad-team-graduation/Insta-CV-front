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

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
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

  if (loading) {
    return <div className="container mx-auto py-6 px-4 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 px-4 text-center text-red-500">{error}</div>;
  }

  // Map skills to the format expected by OtherSkills component
  const mappedSkills = profileData?.userSkills?.map(skill => ({
    id: skill.id || `skill-${skill.skill.replace(/\s+/g, '-').toLowerCase()}`,
    name: skill.skill,
    level: skill.level?.toLowerCase() ?? ''
  })) || [];

  // Map experiences to the format expected by ExperienceSection component
  const mappedExperiences = profileData?.experienceList?.map(exp => ({
    companyLogo: "https://via.placeholder.com/40", // Placeholder until you have actual logos
    position: exp.jobTitle,
    city: exp.city,
    country: exp.country,
    company: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    present: exp.present,
    location: `${exp.city}, ${exp.country}`,
    description: exp.description,
    duration: {
      startDate: formatDate(exp.startDate),
      endDate: exp.present ? "Present" : formatDate(exp.endDate)
    },
    months: calculateMonths(exp.startDate, exp.endDate, exp.present),
    responsibilities: [exp.description],
    techStack: [] // Add tech stack if available in your data
  })) || [];

  // Map educations to the format expected by EducationSection component
  const mappedEducations = profileData?.educationList?.map(edu => ({
    ...edu,
    duration: {
      startDate: formatDate(edu.startDate),
      endDate: edu.present ? "Present" : formatDate(edu.endDate)
    }
  })) || [];

  // Map projects to the format expected by ProjectSection component
  const mappedProjects = profileData?.projects?.map(project => ({
    ...project,
    duration: {
      startDate: formatDate(project.startDate),
      endDate: project.present ? "Present" : formatDate(project.endDate)
    },
    // Optionally map skills if needed
    skills: project.skills?.map(skill => ({
      id: skill.id,
      skill: skill.skill
    })) || []
  })) || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
      {profileData && (
        <>
          <Card className="mb-6">
            <CardContent>
              <ProfileHeader
                name={profileData.personalDetails?.fullName || ""}
                title={profileData.personalDetails?.jobTitle || "Software Engineer"}
                avatar="/lovable-uploads/3a91b290-2dee-4e8c-99ab-1ee517bcf7a0.png"
                country={profileData.personalDetails?.address?.split(", ")[2] || ""}
                email={profileData.personalDetails?.email || ""}
                phone={profileData.personalDetails?.phone || ""}
                location={profileData.personalDetails?.address || ""}
                jobTitle={profileData.personalDetails?.jobTitle || "Software Engineer"}
              />
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardContent>
              <PersonalDetailsSection
                name={profileData.personalDetails?.fullName || ""}
                email={profileData.personalDetails?.email || ""}
                phone={profileData.personalDetails?.phone || ""}
                jobTitle={profileData.personalDetails?.jobTitle || "Software Engineer"}
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

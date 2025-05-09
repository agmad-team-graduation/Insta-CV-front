import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import SkillsSection from "@/components/SkillSection";
import EducationSection from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import apiClient from "./utils/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // Prepare the data to be sent to the backend
      const dataToSave = {
        profileId: profileData.profileId,
        personalDetails: profileData.personalDetails,
        educationList: profileData.educationList,
        experienceList: profileData.experienceList,
        userSkills: profileData.userSkills,
        projects: profileData.projects
      };
      
      // Send the PUT request
      await apiClient.put("/api/v1/profiles/update", dataToSave);
      
      // Show success message
      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile data:", err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6 px-4 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 px-4 text-center text-red-500">{error}</div>;
  }

  // Map skills to the format expected by OtherSkills component
  // Map skills to the format expected by OtherSkills component
  const mappedSkills = profileData?.userSkills?.map(skill => ({
    id: skill.id || `skill-${skill.skill.replace(/\s+/g, '-').toLowerCase()}`,  // Use existing ID or generate one
    name: skill.skill,
    level: skill.level.toLowerCase()
  })) || [];

  // Map experiences to the format expected by ExperienceSection component
  const mappedExperiences = profileData?.experienceList?.map(exp => ({
    companyLogo: "https://via.placeholder.com/40", // Placeholder until you have actual logos
    position: exp.jobTitle,
    company: exp.company,
    location: `${exp.city}, ${exp.country}`,
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
    degree: edu.degree,
    institution: edu.school,
    duration: {
      startDate: formatDate(edu.startDate),
      endDate: edu.present ? "Present" : formatDate(edu.endDate)
    }
  })) || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl ">
      {/* Save Button - Positioned at the top right for visibility */}
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      {profileData && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
          <ProfileHeader 
            name={profileData.personalDetails?.fullName || ""}
            title={profileData.personalDetails?.jobTitle || "Software Engineer"}
            avatar="/lovable-uploads/3a91b290-2dee-4e8c-99ab-1ee517bcf7a0.png"
            country={profileData.personalDetails?.address?.split(", ")[2] || ""}
            countryFlag="🇪🇬"
            email={profileData.personalDetails?.email || ""}
            phone={profileData.personalDetails?.phone || ""}
            linkedinUrl=""
            isVerified={true}
            creationDate="Mar 26, 2025"
            expectedPay="$4500/month"
          />
        </div>
      )}
      
      {/* Skills Section */}
      <div className="mb-6 bg-white rounded-lg">
        <SkillsSection data={mappedSkills} />
      </div>
      
      {/* Experience Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Work Experience</h2>
        <ExperienceSection experiences={mappedExperiences} />
      </div>
      
      {/* Education Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <EducationSection educations={mappedEducations} />
      </div>

      {/* Save Button - Also at the bottom for convenience */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
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

// Icon components
const LightBulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.66347 17H14.3365M12 3V4M18.5 6.5L17.5 7.5M21 12H20M4 12H3M6.5 6.5L7.5 7.5M12 18C9.23858 18 7 15.7614 7 13C7 10.2386 9.23858 8 12 8C14.7614 8 17 10.2386 17 13C17 15.7614 14.7614 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BugIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7L18.133 7.867M19 17L18.133 16.133M5 7L5.867 7.867M5 17L5.867 16.133M12 3V5M12 19V21M8.5 20.001H15.5M7 10.5H17M7 13.5H17M8 7.5C8 6.119 9.119 5 10.5 5H13.5C14.881 5 16 6.119 16 7.5V18C16 19.105 15.105 20 14 20H10C8.895 20 8 19.105 8 18V7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 9.5C15.5 11.433 13.933 13 12 13C10.067 13 8.5 11.433 8.5 9.5C8.5 7.567 10.067 6 12 6C13.933 6 15.5 7.567 15.5 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.99976 21C6.99976 16.583 9.16671 14 11.9998 14C14.8329 14 16.9998 16.583 16.9998 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Profile;

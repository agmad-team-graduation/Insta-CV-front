import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProfileSetupModal from '@/profile-flow/components/ProfileSetupModal';
import apiClient from '@/common/utils/apiClient';

const ProfileFlow = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Function to ensure all profile data has proper default values
  const sanitizeProfileData = (data) => {
    return {
      personalDetails: {
        fullName: data.personalDetails?.fullName || '',
        jobTitle: data.personalDetails?.jobTitle || '',
        bio: data.personalDetails?.bio || ''
      },
      educationList: data.educationList?.map(edu => ({
        degree: edu.degree || '',
        school: edu.school || '',
        city: edu.city || '',
        country: edu.country || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        Present: edu.present || false,
        description: edu.description || ''
      })) || [],
      experienceList: data.experienceList?.map(exp => ({
        jobTitle: exp.jobTitle || '',
        company: exp.company || '',
        city: exp.city || '',
        country: exp.country || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        Present: exp.present || false,
        description: exp.description || ''
      })) || [],
      userSkills: data.userSkills?.map(skill => ({
        skill: skill.skill || '',
        level: skill.level || 'BEGINNER'
      })) || [],
      projects: []
    };
  };

  const handleClose = async (finalProfileData) => {
    setIsModalOpen(false);
    
    if (finalProfileData) {
      try {
        // Sanitize the profile data to ensure no null values
        const sanitizedData = sanitizeProfileData(finalProfileData);
        // Send profile creation request
        await apiClient.post('/api/v1/profiles/create', sanitizedData);
        toast.success('Profile created successfully!');
      } catch (error) {
        console.error('Error creating profile:', error);
        toast.error('Failed to create profile. Please try again.');
      }
    }
    
    // Navigate to dashboard after profile setup is complete
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Your Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a comprehensive professional profile that showcases your skills, experience, and achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
          <div className="bg-white/80 border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Personal Info</h3>
            <p className="text-gray-600 text-sm">Name, title, and bio</p>
          </div>
          <div className="bg-white/80 border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Education</h3>
            <p className="text-gray-600 text-sm">Academic background</p>
          </div>
          <div className="bg-white/80 border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Experience</h3>
            <p className="text-gray-600 text-sm">Work history</p>
          </div>
          <div className="bg-white/80 border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Skills</h3>
            <p className="text-gray-600 text-sm">Technical & soft skills</p>
          </div>
        </div>
      </div>

      <ProfileSetupModal
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default ProfileFlow; 
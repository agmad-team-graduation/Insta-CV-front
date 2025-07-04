import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import PersonalDetailsStep from './profile-steps/PersonalDetailsStep';
import EducationStep from './profile-steps/EducationStep';
import ExperienceStep from './profile-steps/ExperienceStep';
import SkillsStep from './profile-steps/SkillsStep';
import { ProfileData, PersonalDetails, Education, Experience, Skill } from '@/common/utils/profile';
import { useCookies } from 'react-cookie';
import useUserStore from '@/store/userStore';
import apiClient from '@/common/utils/apiClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: (profileData?: ProfileData) => void;
  onBackToChoice?: () => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, onBackToChoice }) => {
  const [cookies] = useCookies(['user']);
  const { user } = useUserStore();
  const navigate = useNavigate();
  
  // Get user name from either the global store or cookies
  const getUserName = () => {
    if (user?.name) return user.name;
    if (cookies.user?.name) return cookies.user.name;
    return '';
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    personalDetails: { fullName: getUserName(), jobTitle: '', bio: '' },
    educationList: [],
    experienceList: [],
    userSkills: []
  });

  // Update profile data when user data becomes available
  useEffect(() => {
    const userName = getUserName();
    if (userName && !profileData.personalDetails.fullName) {
      setProfileData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          fullName: userName
        }
      }));
    }
  }, [user, cookies.user]);

  const steps = [
    { title: 'Personal Info' },
    { title: 'Education' },
    { title: 'Experience' },
    { title: 'Skills' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0 && onBackToChoice) {
      onBackToChoice();
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onClose(profileData);
  };

  // Function to ensure all profile data has proper default values
  const sanitizeProfileData = (data: ProfileData) => {
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

  // Handle modal close attempts (clicking outside, pressing escape)
  const handleModalCloseAttempt = async () => {
    toast.error('You must complete your profile before leaving this page.');
    // Do not close the modal or navigate away
  };

  const updatePersonalDetails = (data: PersonalDetails) => {
    setProfileData(prev => ({ ...prev, personalDetails: data }));
  };

  const updateEducation = (data: Education[]) => {
    setProfileData(prev => ({ ...prev, educationList: data }));
  };

  const updateExperience = (data: Experience[]) => {
    setProfileData(prev => ({ ...prev, experienceList: data }));
  };

  const updateSkills = (data: Skill[]) => {
    setProfileData(prev => ({ ...prev, userSkills: data }));
  };

  if (!isOpen) return null;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDetailsStep
            data={profileData.personalDetails}
            onUpdate={updatePersonalDetails}
          />
        );
      case 1:
        return (
          <EducationStep
            data={profileData.educationList}
            onUpdate={updateEducation}
          />
        );
      case 2:
        return (
          <ExperienceStep
            data={profileData.experienceList}
            onUpdate={updateExperience}
          />
        );
      case 3:
        return (
          <SkillsStep
            data={profileData.userSkills}
            onUpdate={updateSkills}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleModalCloseAttempt} // Handle clicking outside
    >
      <Card 
        className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden bg-white border border-gray-200 shadow-2xl"
        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Only stop propagation, do not call handleModalCloseAttempt
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30" />
        
        {/* Header */}
        <div className="relative border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
              <p className="text-gray-600 mt-1">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6 max-h-[60vh] overflow-y-auto">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="relative border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="default"
              onClick={handlePrevious}
              disabled={false}
              className={`text-gray-600 hover:text-gray-800 hover:bg-gray-100 ${currentStep !== 0 ? '' : ''}`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="ghost"
              size="default"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              Skip
            </Button>

            <Button
              variant="default"
              size="default"
              onClick={currentStep === steps.length - 1 ? handleFinish : handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetupModal;

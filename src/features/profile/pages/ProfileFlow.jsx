import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProfileSetupModal from '@/profile-flow/components/ProfileSetupModal';
import apiClient from '@/common/utils/apiClient';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/common/components/ui/dialog';
import { Upload, FileText, UserPlus, Loader2 } from 'lucide-react';
import { Progress } from '@/common/components/ui/progress';

const ProfileFlow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(true);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [selectedCVFile, setSelectedCVFile] = useState(null);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleManualProfile = () => {
    setShowChoiceModal(false);
    setIsModalOpen(true);
  };

  const handleCVUpload = () => {
    setShowChoiceModal(false);
    // Trigger file input
    document.getElementById('cv-upload').click();
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
    // Automatically upload with overwrite=true since this is profile creation
    handleCVUploadConfirm(true, file);
  };

  const handleCVUploadConfirm = async (shouldOverwrite, file = null) => {
    const fileToUpload = file || selectedCVFile;
    if (!fileToUpload) return;

    try {
      setUploadingCV(true);
      setShowUploadProgress(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', fileToUpload);
      const sanitizedData = sanitizeProfileData({});
      
      // Start progress simulation immediately
      const startTime = Date.now();
      const maxDuration = 20000; // 20 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / maxDuration) * 100, 95); // Cap at 95% until response
        setUploadProgress(progress);
      }, 100);
      
      // Make API calls
      await apiClient.post('/api/v1/profiles/create', sanitizedData);
      const response = await apiClient.post(`/api/v1/profiles/upload-cv?overwrite=${shouldOverwrite}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(() => {
        toast.success('CV uploaded successfully! Profile created.');
        navigate('/dashboard');
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

      {/* Hidden file input for CV upload */}
      <input
        type="file"
        id="cv-upload"
        accept=".pdf"
        onChange={handleCVFileSelect}
        style={{ display: 'none' }}
        disabled={uploadingCV}
      />

      {/* Choice Modal */}
      <Dialog open={showChoiceModal} onOpenChange={setShowChoiceModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
            
            {/* Header */}
            <div className="relative p-8 pb-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your Profile
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-base">
                  Choose how you'd like to get started with your professional profile
                </DialogDescription>
              </div>
            </div>

            {/* Options */}
            <div className="relative px-8 pb-8">
              <div className="grid grid-cols-1 gap-4">
                {/* Manual Profile Option */}
                <div 
                  className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleManualProfile}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <UserPlus className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                          Manual Profile Creation
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Fill out your profile step by step with detailed information
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            Detailed
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CV Upload Option */}
                <div 
                  className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleCVUpload}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                          Upload CV
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Upload your existing CV and we'll extract the information
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Quick Start
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  You can always edit your profile later from the profile page
                </p>
              </div>
            </div>
          </div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
            
            {/* Content */}
            <div className="relative p-8">
              <div className="text-center">
                {/* Animated Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
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
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300 ease-out"
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
                  {uploadProgress >= 100 && "Profile created successfully!"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProfileSetupModal
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default ProfileFlow; 
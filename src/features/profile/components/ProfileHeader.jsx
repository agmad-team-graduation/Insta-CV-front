import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import PhotoUpload from "./PhotoUpload";
import apiClient from "@/common/utils/apiClient";

const ProfileHeader = ({
  name,
  title,
  avatar: initialAvatar,
  city,
  startDate,
  endDate,
  country,
  countryFlag,
  email,
  phone,
  location,
  jobTitle,
  onPhotoUpdate,
}) => {
  const [avatar, setAvatar] = useState(initialAvatar);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    const checkPhotoExists = async () => {
      try {
        const response = await apiClient.get('/api/users/photo/exists');
        setHasPhoto(response.data.exists);
      } catch (error) {
        console.error('Error checking photo existence:', error);
      }
    };
    checkPhotoExists();
  }, []);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (hasPhoto) {
        try {
          const response = await apiClient.get('/api/users/photo');
          setAvatar(response.data.photoUrl);
          if (onPhotoUpdate) {
            onPhotoUpdate(response.data.photoUrl);
          }
        } catch (error) {
          console.error('Error fetching photo:', error);
        }
      }
    };
    fetchPhoto();
  }, [hasPhoto, onPhotoUpdate]);

  const handlePhotoUpdate = (photoUrl) => {
    setAvatar(photoUrl);
    setHasPhoto(!!photoUrl);
    if (onPhotoUpdate) {
      onPhotoUpdate(photoUrl);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="flex-shrink-0">
        <PhotoUpload currentPhotoUrl={avatar} onPhotoUpdate={handlePhotoUpdate} />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="font-bold text-xl md:text-2xl mb-2 text-black text-left">{name}</div>
        
        {/* Desktop view - horizontal layout */}
        <div className="hidden sm:flex flex-wrap items-center gap-3 text-gray-600 text-sm md:text-base mb-1 mt-2">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            {jobTitle || title}
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            {email}
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            {phone}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            {location || country}
          </div>
        </div>

        {/* Mobile view - vertical layout */}
        <div className="sm:hidden space-y-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{jobTitle || title}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{phone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location || country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

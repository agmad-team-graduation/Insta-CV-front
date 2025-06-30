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
    <div className="flex items-center gap-6">
      <PhotoUpload currentPhotoUrl={avatar} onPhotoUpdate={handlePhotoUpdate} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-2xl mb-1 text-black text-left">{name}</div>
        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-base mb-1 mt-2">
          {(jobTitle || title) && (
            <>
              <Briefcase className="w-5 h-5 inline-block mr-1" />
              {jobTitle || title}
            </>
          )}
          {email && (
            <>
              <Mail className="w-5 h-5 inline-block ml-4 mr-1" />
              {email}
            </>
          )}
          {phone && (
            <>
              <Phone className="w-5 h-5 inline-block ml-4 mr-1" />
              {phone}
            </>
          )}
          {(location || country) && (
            <>
              <MapPin className="w-5 h-5 inline-block ml-4 mr-1" />
              {location || country}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";

export const ProfileHeader = ({
  name,
  title,
  avatar,
  city,
  startDate,
  endDate,
  country,
  countryFlag,
  email,
  phone,
  location,
  jobTitle,
}) => {
  return (
    <div className="flex items-center gap-6">
      <Avatar className="w-20 h-20 border bg-gray-100">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-2xl mb-1 text-black text-left">{name}</div>
        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-base mb-1">
          <Briefcase className="w-5 h-5 inline-block mr-1" />
          {jobTitle || title}
          <Mail className="w-5 h-5 inline-block ml-4 mr-1" />
          {email}
          <Phone className="w-5 h-5 inline-block ml-4 mr-1" />
          {phone}
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-base">
          <MapPin className="w-5 h-5 inline-block mr-1" />
          {location || country}
        </div>
      </div>
    </div>
  );
};

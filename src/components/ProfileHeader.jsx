
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ProfileHeader = ({
  name,
  title,
  avatar,
  country,
  countryFlag,
  email,
  phone,
  linkedinUrl,
  isVerified = true,
  creationDate,
  expectedPay,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-4">My profile</h1>
        <p className="text-sm text-gray-500">Account created on {creationDate}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Avatar className="w-20 h-20 border">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold">{name}</h2>
            {isVerified && (
              <Badge className="bg-green-500 text-white hover:bg-green-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:gap-4 mb-2">
            <p className="text-gray-700">{title}</p>
            {linkedinUrl && (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn profile</span>
              </a>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{country}</span>
              <span className="text-lg">{countryFlag}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{"+2"+phone}</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex space-x-2 items-center">
                <span className="text-gray-700">Expected pay:</span>
                <span className="font-semibold">{expectedPay}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <span>Available Part Time</span>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="invisible">Spacer</Button>
        </div>
      </div>
    </div>
  );
};

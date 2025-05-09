
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const ExperienceItem = ({
  companyLogo,
  position,
  company,
  location,
  duration,
  months,
  responsibilities,
  techStack,
}) => {
  return (
    <div className="mb-6 border-b pb-6">
      <div className="flex justify-between mb-2">
        <div className="flex gap-4">
          
          <div>
            <h3 className="font-semibold text-lg">{position}</h3>
            <p className="text-gray-600">{company} at {location}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{duration.startDate} - {duration.endDate}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          {months && <span className="text-sm text-gray-500">{months} months</span>}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 uppercase text-xs mb-2">RESPONSIBILITIES</p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          {responsibilities.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
        {responsibilities.length > 2 && (
          <Button variant="link" className="p-0 text-blue-600">
            See Less
          </Button>
        )}
      </div>
      
      {techStack && techStack.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-700 uppercase text-xs mb-2">TECH STACKS USED</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className="bg-white">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ExperienceSection = ({ experiences }) => {
  return (
    <div className="mb-6">
      
      {experiences.map((experience, index) => (
        <ExperienceItem key={index} {...experience} />
      ))}
      
      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-600">
          <Plus className="h-4 w-4" />
          <span>Add more</span>
        </Button>
      </div>
    </div>
  );
};

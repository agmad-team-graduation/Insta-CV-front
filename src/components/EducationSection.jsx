import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

export const EducationItem = ({
  logo,
  degree,
  institution,
  duration,
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <div className="flex gap-4">
          
          <div>
            <h3 className="font-semibold">{degree}</h3>
            <p className="text-gray-600">{institution}</p>
            <p className="text-sm text-gray-500">
              {duration.startDate} - {duration.endDate}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const EducationSection = ({ educations }) => {
  return (
    <div className="mb-6">
      
      {educations.map((education, index) => (
        <EducationItem key={index} {...education} />
      ))}
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-600">
          <Plus className="h-4 w-4" />
          <span>Add more</span>
        </Button>
      </div>
    </div>
  );
};
import React from 'react';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { PersonalDetails } from '@/common/utils/profile';

interface PersonalDetailsStepProps {
  data: PersonalDetails;
  onUpdate: (data: PersonalDetails) => void;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell us about yourself</h3>
        <p className="text-gray-600">Let's start with the basics to create your professional profile</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="mt-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="jobTitle" className="text-gray-700 font-medium">Job Title</Label>
          <Input
            id="jobTitle"
            type="text"
            value={data.jobTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('jobTitle', e.target.value)}
            placeholder="e.g., Software Engineer, Product Manager"
            className="mt-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-gray-700 font-medium">About / Bio</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your experience, and what drives you..."
            rows={4}
            className="mt-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;

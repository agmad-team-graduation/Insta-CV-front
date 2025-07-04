import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Card } from '@/common/components/ui/card';
import { Experience } from '@/common/utils/profile';

interface ExperienceStepProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      jobTitle: '',
      company: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      present: false,
      description: ''
    };
    onUpdate([...data, newExperience]);
    setEditingIndex(data.length);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    const updated = data.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate(updated);
  };

  const removeExperience = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onUpdate(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Work Experience</h3>
        <p className="text-gray-600">Share your professional journey and achievements</p>
      </div>

      <div className="space-y-4">
        {data.map((experience, index) => (
          <Card key={index} className="p-4 bg-white border border-gray-200 shadow-sm">
            {editingIndex === index ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Job Title</Label>
                    <Input
                      type="text"
                      value={experience.jobTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'jobTitle', e.target.value)}
                      placeholder="Senior Backend Developer"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Company</Label>
                    <Input
                      type="text"
                      value={experience.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'company', e.target.value)}
                      placeholder="TechCorp Solutions"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">City</Label>
                    <Input
                      type="text"
                      value={experience.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'city', e.target.value)}
                      placeholder="Boston"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Country</Label>
                    <Input
                      type="text"
                      value={experience.country}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'country', e.target.value)}
                      placeholder="USA"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Start Date (Optional)</Label>
                    <Input
                      type="date"
                      value={experience.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'startDate', e.target.value)}
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">End Date (Optional)</Label>
                    <Input
                      type="date"
                      value={experience.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(index, 'endDate', e.target.value)}
                      disabled={experience.present}
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={experience.present}
                    onCheckedChange={(checked: boolean) => updateExperience(index, 'present', checked)}
                    className="text-blue-600"
                  />
                  <Label htmlFor={`current-${index}`} className="text-gray-700">Present</Label>
                </div>

                <div>
                  <Label className="text-gray-700">Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities, achievements, technologies used..."
                    rows={3}
                    className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setEditingIndex(null)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => setEditingIndex(index)}>
                <h4 className="text-gray-900 font-medium">{experience.jobTitle || 'New Experience'}</h4>
                <p className="text-gray-600">{experience.company}</p>
                {experience.city && experience.country && (
                  <p className="text-gray-500 text-sm">{experience.city}, {experience.country}</p>
                )}
              </div>
            )}
          </Card>
        ))}

        <Button
          variant="outline"
          size="default"
          onClick={addExperience}
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
    </div>
  );
};

export default ExperienceStep;

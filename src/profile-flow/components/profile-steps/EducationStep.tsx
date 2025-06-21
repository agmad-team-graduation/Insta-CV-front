import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Checkbox } from '@/common/components/ui/checkbox'
import { Card } from '@/common/components/ui/card';
import { Education } from '@/common/utils/profile';

interface EducationStepProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

const EducationStep: React.FC<EducationStepProps> = ({ data, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addEducation = () => {
    const newEducation: Education = {
      degree: '',
      school: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      present: false,
      description: ''
    };
    onUpdate([...data, newEducation]);
    setEditingIndex(data.length);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const updated = data.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate(updated);
  };

  const removeEducation = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onUpdate(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Education Background</h3>
        <p className="text-gray-600">Add your educational qualifications and achievements</p>
      </div>

      <div className="space-y-4">
        {data.map((education, index) => (
          <Card key={index} className="p-4 bg-white border border-gray-200 shadow-sm">
            {editingIndex === index ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Degree</Label>
                    <Input
                      type="text"
                      value={education.degree}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="BSc in Computer Science"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">School</Label>
                    <Input
                      type="text"
                      value={education.school}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'school', e.target.value)}
                      placeholder="University name"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">City</Label>
                    <Input
                      type="text"
                      value={education.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'city', e.target.value)}
                      placeholder="Cambridge"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Country</Label>
                    <Input
                      type="text"
                      value={education.country}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'country', e.target.value)}
                      placeholder="USA"
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Start Date</Label>
                    <Input
                      type="date"
                      value={education.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'startDate', e.target.value)}
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">End Date</Label>
                    <Input
                      type="date"
                      value={education.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(index, 'endDate', e.target.value)}
                      disabled={education.present}
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`present-${index}`}
                    checked={education.present}
                    onCheckedChange={(checked: boolean) => updateEducation(index, 'present', checked)}
                    className="text-blue-600"
                  />
                  <Label htmlFor={`present-${index}`} className="text-gray-700">Present</Label>
                </div>

                <div>
                  <Label className="text-gray-700">Description</Label>
                  <Textarea
                    value={education.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateEducation(index, 'description', e.target.value)}
                    placeholder="Describe your achievements, focus areas, honors..."
                    rows={3}
                    className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
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
                <h4 className="text-gray-900 font-medium">{education.degree || 'New Education'}</h4>
                <p className="text-gray-600">{education.school}</p>
                {education.city && education.country && (
                  <p className="text-gray-500 text-sm">{education.city}, {education.country}</p>
                )}
              </div>
            )}
          </Card>
        ))}

        <Button
          variant="outline"
          size="default"
          onClick={addEducation}
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
    </div>
  );
};

export default EducationStep;

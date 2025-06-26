import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Badge } from '@/common/components/ui/badge';
import { Skill } from '@/common/utils/profile';

interface SkillsStepProps {
  data: Skill[];
  onUpdate: (data: Skill[]) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ data, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER');

  const addSkill = () => {
    if (newSkill.trim() && !data.find(skill => skill.skill.toLowerCase() === newSkill.toLowerCase())) {
      onUpdate([...data, { skill: newSkill.trim(), level: newLevel }]);
      setNewSkill('');
      setNewLevel('BEGINNER');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onUpdate(data.filter(skill => skill.skill !== skillToRemove));
  };

  const updateSkillLevel = (skillName: string, level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') => {
    onUpdate(data.map(skill => 
      skill.skill === skillName ? { ...skill, level } : skill
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'INTERMEDIATE': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ADVANCED': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'EXPERT': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Skills</h3>
        <p className="text-gray-600">Add your technical and soft skills with proficiency levels</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={newSkill}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., React.js, Communication)"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Select value={newLevel} onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') => setNewLevel(value)}>
            <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="BEGINNER" className="text-blue-700">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE" className="text-purple-700">Intermediate</SelectItem>
              <SelectItem value="ADVANCED" className="text-orange-700">Advanced</SelectItem>
              <SelectItem value="EXPERT" className="text-purple-700">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="default"
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.length > 0 && (
          <div className="space-y-3">
            <Label className="text-gray-700 text-sm font-medium">Your Skills ({data.length})</Label>
            <div className="flex flex-wrap gap-2">
              {data.map((skill, index) => (
                <div key={index} className="group relative">
                  <Badge 
                    variant="secondary"
                    className={`${getLevelColor(skill.level)} border px-3 py-1 text-sm font-medium`}
                  >
                    {skill.skill}
                    <span className="ml-2 text-xs opacity-70">
                      {skill.level}
                    </span>
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSkill(skill.skill)}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No skills added yet. Start by adding your first skill above!</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-gray-900 font-medium mb-2">💡 Skill Level Guide</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Beginner</Badge>
            <span className="text-gray-600">Basic understanding, limited experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Intermediate</Badge>
            <span className="text-gray-600">Good working knowledge, some experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 text-xs">Advanced</Badge>
            <span className="text-gray-600">Advanced proficiency, extensive experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300 text-xs">Expert</Badge>
            <span className="text-gray-600">Advanced proficiency, extensive experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Github, Code } from "lucide-react";
import { Badge } from "@/common/components/ui/badge";
import { Progress } from "@/common/components/ui/progress";
import { Button } from "@/common/components/ui/button";
import apiClient from "@/common/utils/apiClient";
import { toast } from "sonner";

const GithubSkillItem = ({ skill, userSkills, onSkillAdded }) => {
  const skillName = typeof skill === 'string' ? skill : skill.name || skill.skill;
  // Check if skill exists in userSkills
  const alreadyExists = Array.isArray(userSkills) && userSkills.some(
    s => (typeof s === 'string' ? s : s.name || s.skill) === skillName
  );
  const handleAddSkill = async () => {
    try {
      await apiClient.put('/api/v1/profiles/add-skill', { skill: skillName });
      toast.success('Skill has been added to your profile');
      // Call the callback to update the parent state
      if (onSkillAdded) {
        onSkillAdded(skillName);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Code className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{skillName}</span>
            {skill.percentage && (
              <Badge variant="outline" className="text-xs">
                {skill.percentage}%
              </Badge>
            )}
          </div>
          {skill.percentage && (
            <Progress value={skill.percentage} className="h-2 w-full" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {skill.repositories && (
          <Badge variant="secondary" className="ml-4 text-xs">
            {skill.repositories} {skill.repositories === 1 ? 'repo' : 'repos'}
          </Badge>
        )}
        {!alreadyExists && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6 p-0 rounded-full border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-700 shadow-none"
            onClick={handleAddSkill}
            title={`Send ${skillName}`}
          >
            <span className="text-lg leading-none">+</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const GithubSkillsSection = ({ skills, userSkills, onSkillAdded }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-bold text-xl text-black text-left flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Skills
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          {skills.length} {skills.length === 1 ? 'Skill' : 'Skills'}
        </Badge>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No GitHub skills found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <GithubSkillItem 
                key={skill.id || index} 
                skill={skill} 
                userSkills={userSkills} 
                onSkillAdded={onSkillAdded}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GithubSkillsSection; 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Star } from 'lucide-react';

const ProfileSkills = () => {
  const skills = [
    { name: 'React', level: 90, category: 'Frontend', inDemand: true },
    { name: 'TypeScript', level: 85, category: 'Language', inDemand: true },
    { name: 'Node.js', level: 80, category: 'Backend', inDemand: true },
    { name: 'Python', level: 75, category: 'Language', inDemand: false },
    { name: 'AWS', level: 70, category: 'Cloud', inDemand: true },
    { name: 'Docker', level: 65, category: 'DevOps', inDemand: false }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Your Skills</span>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{skill.name}</span>
                {skill.inDemand && (
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                )}
              </div>
              <Badge 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-600"
              >
                {skill.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={skill.level} className="flex-1 h-2" />
              <span className="text-xs text-gray-500 min-w-[30px]">{skill.level}%</span>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 mb-2">Skill Insights</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">High demand skills</span>
            </div>
            <p className="text-xs text-gray-500">
              Your React and TypeScript skills are highly sought after in 89% of saved jobs.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSkills;

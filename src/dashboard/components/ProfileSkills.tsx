import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Progress } from '@/common/components/ui/progress';
import { Button } from '@/common/components/ui/button';
import { Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';
import ComponentLoader from '@/common/components/ui/ComponentLoader';

// Types for the API response
interface UserSkillResponse {
  id: number;
  skill: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  marketDemandPercentage: number;
}

interface TransformedSkill {
  name: string;
  level: number;
  inDemand: boolean;
}

const ProfileSkills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<TransformedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert skill level to percentage
  const getSkillLevelPercentage = (level: string): number => {
    const levelMap: Record<string, number> = {
      'BEGINNER': 25,
      'INTERMEDIATE': 50,
      'ADVANCED': 75,
      'EXPERT': 100,
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 100
    };
    return levelMap[level] || 50;
  };

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      const response = await apiClient.get('/api/v1/profiles/me/skills');
      const skillsData: UserSkillResponse[] = response.data || [];
      
      // Transform skills data to use skill level percentage
      const transformedSkills: TransformedSkill[] = skillsData
        .map((skill: UserSkillResponse) => ({
          name: skill.skill,
          level: getSkillLevelPercentage(skill.level), // Use skill level percentage
          inDemand: isSkillInDemand(skill.skill)
        }))
        .filter(skill => skill.level > 0); // Filter out skills with 0% level
      
      setSkills(transformedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
      toast.error('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  const isSkillInDemand = (skillName: string): boolean => {
    const inDemandSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'AWS', 'Docker'];
    return inDemandSkills.includes(skillName);
  };

  // Load skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Your Skills</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAddSkill}
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ComponentLoader message="Loading skills..." size="small" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Your Skills</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleAddSkill}
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No skills found.</p>
            <Button 
              variant="link" 
              size="default"
              className="text-blue-600"
              onClick={handleAddSkill}
            >
              Add skills to your profile
            </Button>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{skill.name}</span>
                    {(skill.inDemand || skill.level > 75) && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress className="flex-1 h-2" value={skill.level} {...({} as any)} />
                  <span className="text-xs text-gray-500 min-w-[30px]">{Math.round(skill.level)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {skills.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Skill Level Insights</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">High demand skills & advanced/expert level skills</span>
              </div>
              <p className="text-xs text-gray-500">
                Percentages show your skill proficiency level.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSkills;

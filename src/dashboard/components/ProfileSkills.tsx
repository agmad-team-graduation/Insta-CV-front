import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Progress } from '@/common/components/ui/progress';
import { Button } from '@/common/components/ui/button';
import { Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';
import ComponentLoader from '@/common/components/ui/ComponentLoader';

const ProfileSkills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch skills from API (same as Dashboard.jsx)
  const fetchSkills = async () => {
    try {
      const response = await apiClient.get('/api/v1/profiles/me/skills');
      const skillsData = response.data || [];
      
      // Transform skills data to match dashboard format (same as Dashboard.jsx)
      const transformedSkills = skillsData.map(skill => ({
        name: skill.skill || skill.name,
        level: getSkillLevelPercentage(skill.level),
        category: getSkillCategory(skill.skill || skill.name),
        inDemand: isSkillInDemand(skill.skill || skill.name)
      }));
      
      setSkills(transformedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
      toast.error('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions (same as Dashboard.jsx)
  const getSkillLevelPercentage = (level) => {
    const levelMap = {
      'BEGINNER': 25,
      'INTERMEDIATE': 50,
      'PROFICIENT': 75,
      'EXPERT': 90,
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 90
    };
    return levelMap[level] || 50;
  };

  const getSkillCategory = (skillName) => {
    const categories = {
      'React': 'Frontend',
      'Vue': 'Frontend',
      'Angular': 'Frontend',
      'JavaScript': 'Language',
      'TypeScript': 'Language',
      'Python': 'Language',
      'Java': 'Language',
      'Node.js': 'Backend',
      'Express': 'Backend',
      'Spring': 'Backend',
      'AWS': 'Cloud',
      'Azure': 'Cloud',
      'Docker': 'DevOps',
      'Kubernetes': 'DevOps'
    };
    return categories[skillName] || 'Other';
  };

  const isSkillInDemand = (skillName) => {
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
        <CardHeader>
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
      <CardHeader>
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
          skills.map((skill, index) => (
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
          ))
        )}
        
        {skills.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Skill Insights</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">High demand skills</span>
              </div>
              <p className="text-xs text-gray-500">
                Your skills are highly sought after in the job market.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSkills;

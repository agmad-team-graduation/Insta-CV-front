import { Button } from '@/common/components/ui/button';
import { Card, CardContent } from '@/common/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddJobDialog from '@/features/jobs/components/AddJob/AddJobDialog';
import { toast } from 'sonner';

const QuickActions = () => {
  const navigate = useNavigate();
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);

  const handleGenerateAICV = () => {
    navigate('/resumes?create=true');
    toast.info('Redirecting to CV builder...');
  };

  const handleAddJob = () => {
    setShowAddJobDialog(true);
  };

  const handleJobAdded = () => {
    setShowAddJobDialog(false);
    toast.success('Job added successfully!');
  };

  return (
    <>
      <Card className="mt-8 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Ready to create your next CV?
              </h3>
              <p className="text-gray-600 text-sm">
                Use AI to tailor your CV for specific job requirements in seconds
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleGenerateAICV}
                variant="default"
                size="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI CV
              </Button>
              <Button 
                onClick={handleAddJob}
                variant="outline" 
                size="default"
                className="border-blue-200 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <AddJobDialog 
        open={showAddJobDialog}
        onOpenChange={setShowAddJobDialog}
        onJobAdded={handleJobAdded}
      />
    </>
  );
};

export default QuickActions;

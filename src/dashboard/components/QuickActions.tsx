
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';

const QuickActions = () => {
  return (
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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI CV
            </Button>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

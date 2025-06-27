import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/common/components/ui/dialog';
import { ArrowLeft, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';
import { Badge } from '@/common/components/ui/badge';
import PageLoader from "@/common/components/ui/PageLoader";

// Placeholder for the API endpoint
const QUESTIONS_API_URL = '';

const InterviewQuestionsPage = () => {
  const { jobID } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);

  const fetchQuestions = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await apiClient.post(`/api/v1/jobs/interview-questions`,{jobId:jobID, numberOfQuestions:10});
      
      // Set the questions from the response data
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
        if (isRefresh) {
          toast.success('New questions loaded successfully!');
        }
      } else {
        setError("No questions found for this job.");
      }
    } catch (err) {
      console.error("Error fetching interview questions:", err.response?.data?.message || err.message);
      setError("Failed to load interview questions.");
      toast.error("Failed to load interview questions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [jobID]);

  const handleRefresh = () => {
    setFlippedCardId(null); // Reset flipped cards
    fetchQuestions(true);
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Interview Questions" 
        subtitle="We're preparing personalized questions for you..."
      />
    );
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" className="flex items-center space-x-3 text-lg" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-blue-600" />
              Interview Questions
            </h1>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline" 
              className="flex items-center space-x-2"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{refreshing ? 'Loading...' : 'New Questions'}</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {questions.map((q, index) => (
            <div key={q.id || index} className="group [perspective:1000px]">
              <div
                className={`relative w-full h-80 cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${flippedCardId === (q.id || index) ? '[transform:rotateY(180deg)]' : ''}`}
                tabIndex={0}
                onClick={() => setFlippedCardId(flippedCardId === (q.id || index) ? null : (q.id || index))}
              >
                {/* Front */}
                <Card className="absolute w-full h-full [backface-visibility:hidden] bg-white shadow-md rounded-xl border border-gray-200 group-hover:shadow-xl transition-shadow">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {q.category || "General"}
                    </Badge>
                    <Badge 
                      variant={q.difficulty === 'Hard' ? 'destructive' : q.difficulty === 'Medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {q.difficulty || "Unknown"}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-6 pt-16">
                    <span className="text-gray-900 text-center text-lg font-semibold">{q.question || "No question provided."}</span>
                  </div>
                </Card>
                {/* Back */}
                <Card className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-blue-50 shadow-md rounded-xl border border-blue-200">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <span className="text-blue-700 text-xl mb-4 block"><Sparkles className="inline w-5 h-5 mr-1 text-blue-400" />Answer</span>
                    <div className="text-base text-gray-800 text-center line-clamp-4 mb-4 flex-1 flex items-center justify-center">{q.expectedAnswer || "No answer provided."}</div>
                    {(q.expectedAnswer && q.expectedAnswer.length > 100) && (
                      <Button className="mt-2" variant="outline" onClick={(e) => { 
                        e.stopPropagation();
                        setSelectedQuestion(q); 
                        setShowDialog(true); 
                      }}>
                        View More
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg rounded-2xl p-8 bg-white border border-blue-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-2xl flex items-center mb-2"><Sparkles className="inline w-6 h-6 mr-2 text-blue-400" />Full Answer</DialogTitle>
              <DialogDescription className="text-lg text-gray-700 mb-4">{selectedQuestion?.question || "No question provided."}</DialogDescription>
            </DialogHeader>
            <div className="mt-2 text-gray-900 text-lg leading-relaxed whitespace-pre-line text-center">{selectedQuestion?.expectedAnswer || "No answer provided."}</div>
          </DialogContent>
        </Dialog>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InterviewQuestionsPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/common/components/ui/dialog';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/common/utils/apiClient';

// Placeholder for the API endpoint
const QUESTIONS_API_URL = '';

const InterviewQuestionsPage = () => {
  const { jobID } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(`/api/v1/jobs/interview-questions`,{jobId:jobID, numberOfQuestions:30});
      } catch (err) {
        toast.error("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [jobID]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            <div />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {questions.map((q) => (
            <div key={q.id} className="group [perspective:1000px]">
              <div
                className={`relative w-full h-64 cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${flippedCardId === q.id ? '[transform:rotateY(180deg)]' : ''}`}
                tabIndex={0}
                onClick={() => setFlippedCardId(flippedCardId === q.id ? null : q.id)}
              >
                {/* Front */}
                <Card className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-6 text-lg font-semibold bg-white shadow-md rounded-xl border border-gray-200 group-hover:shadow-xl transition-shadow">
                  <span className="text-blue-700 text-xl mb-2"><Sparkles className="inline w-5 h-5 mr-1 text-blue-400" />Question</span>
                  <span className="text-gray-900 text-center">{q.question}</span>
                </Card>
                {/* Back */}
                <Card className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between items-center p-6 bg-blue-50 shadow-md rounded-xl border border-blue-200">
                  <div>
                    <span className="text-blue-700 text-xl mb-4 block"><Sparkles className="inline w-5 h-5 mr-1 text-blue-400" />Answer</span>
                    <div className="text-base text-gray-800 text-center line-clamp-4 mb-4">{q.answer}</div>
                  </div>
                  {q.answer.length > 100 && (
                    <Button className="mt-2" variant="outline" onClick={() => { setSelectedQuestion(q); setShowDialog(true); }}>
                      View More
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg rounded-2xl p-8 bg-white border border-blue-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-2xl flex items-center mb-2"><Sparkles className="inline w-6 h-6 mr-2 text-blue-400" />Full Answer</DialogTitle>
              <DialogDescription className="text-lg text-gray-700 mb-4">{selectedQuestion?.question}</DialogDescription>
            </DialogHeader>
            <div className="mt-2 text-gray-900 text-lg leading-relaxed whitespace-pre-line text-center">{selectedQuestion?.answer}</div>
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

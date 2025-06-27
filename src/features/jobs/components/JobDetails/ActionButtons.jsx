import React from 'react';
import { FileUp, MessageSquare, RefreshCw, Loader2, ExternalLink } from 'lucide-react';

const ActionButtons = ({
  onGenerateCV,
  onInterviewQuestions,
  onReanalyze,
  onApply,
  isGeneratingCV,
  isReanalyzing,
  isExternal,
  applyUrl
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={onGenerateCV}
          disabled={isGeneratingCV}
          className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGeneratingCV ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileUp className="w-5 h-5" />
          )}
          Generate Resume
        </button>
        
        <button
          onClick={onInterviewQuestions}
          className="flex items-center justify-center gap-3 p-4 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="w-5 h-5" />
          Interview Questions
        </button>
        
        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className="flex items-center justify-center gap-3 p-4 border-2 border-purple-500 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isReanalyzing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Reanalyze Job
        </button>
      </div>

      {/* Apply button for external jobs */}
      {isExternal && applyUrl && (
        <div className="mt-4">
          <button
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 hover:scale-105"
            onClick={onApply}
          >
            <ExternalLink className="w-5 h-5" />
            Apply for this Job
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButtons; 
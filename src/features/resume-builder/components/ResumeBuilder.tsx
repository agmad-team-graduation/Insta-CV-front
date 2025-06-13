import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FileEditIcon, FileTextIcon, DownloadIcon, LayoutIcon, EyeIcon, Loader2Icon } from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import EditorSidebar from './EditorSidebar';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';

const ResumeBuilder: React.FC = () => {
  const { 
    resume, 
    isLoading, 
    error, 
    fetchResume, 
    selectedTemplate,
    isSaving,
    saveResume
  } = useResumeStore();
  
  const [activeTab, setActiveTab] = useState<'content' | 'templates'>('content');
  const [previewMode, setPreviewMode] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Fetch resume data on component mount
    fetchResume();
  }, [fetchResume]);
  
  // Auto-save every 5 seconds when changes are made
  useEffect(() => {
    if (resume && !isSaving) {
      const timeoutId = setTimeout(() => {
        saveResume()
          .then(() => {
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 2000);
          });
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [resume, isSaving, saveResume]);

  const handleDownloadPdf = async () => {
    if (!resume) return;
    
    setIsGeneratingPdf(true);
    
    try {
      // This is handled in the ResumePreview component
      const previewElement = document.getElementById('resume-preview-container');
      if (previewElement) {
        const event = new CustomEvent('generate-pdf');
        previewElement.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading your resume...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md">
          <h2 className="font-bold text-lg mb-2">Error Loading Resume</h2>
          <p>{error}</p>
          <button 
            onClick={() => fetchResume()} 
            className="mt-4 btn bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header with actions */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-3">
              {isSaving && (
                <div className="flex items-center text-gray-500">
                  <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
              {showSaveSuccess && (
                <div className="text-green-600 text-sm flex items-center">
                  <span>✓ Saved</span>
                </div>
              )}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'}`}
                title={previewMode ? 'Exit Preview' : 'Preview Mode'}
              >
                <EyeIcon size={18} />
                <span className="hidden sm:inline">
                  {previewMode ? 'Exit Preview' : 'Preview'}
                </span>
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="btn btn-primary"
                title="Download as PDF"
              >
                {isGeneratingPdf ? (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <DownloadIcon size={18} />
                )}
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
          </div>
        </header>
        {/* Main content area: always side-by-side */}
        <main className="flex-1 flex flex-row gap-0 lg:gap-8 max-w-7xl mx-auto w-full">
          {/* Cards area: visually distinct, wider */}
          <div className="w-full max-w-[520px] min-w-[340px] pr-4">
            <EditorSidebar resume={resume} />
          </div>
          {/* Preview area: visually separated */}
          <section className="flex-1 p-2 md:p-8 overflow-auto bg-gray-100 flex justify-center items-start border-l border-gray-200">
            <ResumePreview resume={resume} />
          </section>
        </main>
      </div>
    </DndContext>
  );
};

export default ResumeBuilder; 
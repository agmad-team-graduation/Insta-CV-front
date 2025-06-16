import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FileEditIcon, FileTextIcon, DownloadIcon, LayoutIcon, EyeIcon, Loader2Icon, ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useResumeStore from '../store/resumeStore';
import EditorSidebar from './EditorSidebar';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import { Input } from "../../../common/components/ui/input";

const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    resume, 
    isLoading, 
    error, 
    fetchResume,
    createNewResume,
    selectedTemplate,
    isSaving,
    saveResume,
    generateCVForJob,
    isGenerating,
    updateResumeTitle
  } = useResumeStore();
  
  const [activeTab, setActiveTab] = useState<'content' | 'templates'>('content');
  const [previewMode, setPreviewMode] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  
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
    const initializeResume = async () => {
      if (id) {
        // If we have an ID, fetch that resume
        await fetchResume(parseInt(id));
      } else {
        // If no ID, create a new resume and navigate to it
        try {
          const newResumeId = await createNewResume();
          navigate(`/resumes/${newResumeId}`);
        } catch (error) {
          console.error('Error creating new resume:', error);
        }
      }
    };

    initializeResume();
  }, [id, fetchResume, createNewResume, navigate]);
  
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

  // Handle CV generation and navigation
  const handleGenerateCV = async (jobId: number) => {
    try {
      await generateCVForJob(jobId);
      // After successful generation, navigate to the new resume
      if (resume?.id) {
        navigate(`/resumes/${resume.id}`);
      }
    } catch (error) {
      console.error('Error generating CV:', error);
    }
  };

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

  const handleTitleEdit = () => {
    if (!resume) return;
    setEditingTitle(resume.cvTitle || `Resume #${resume.id}`);
    setIsEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (!resume) return;
    try {
      await updateResumeTitle(editingTitle);
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error saving title:', error);
    }
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditingTitle('');
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
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
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with actions */}
        <header className="flex-none bg-white shadow-sm border-b border-gray-200 py-3 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="Go Back"
              >
                <ArrowLeftIcon size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center space-x-2">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                      onKeyDown={handleTitleKeyDown}
                      onBlur={handleTitleSave}
                      className="h-8 text-sm w-64"
                      autoFocus
                      type="text"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {resume?.cvTitle || `Resume #${resume?.id}`}
                    </h1>
                    <button
                      onClick={handleTitleEdit}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  previewMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
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
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Download as PDF"
              >
                {isGeneratingPdf ? (
                  <Loader2Icon className="animate-spin h-4 w-4" />
                ) : (
                  <DownloadIcon size={18} />
                )}
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex justify-center items-start py-8 px-80">
          <div className="w-full flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden">
            {/* Left sidebar */}
            {!previewMode && (
              <aside className="w-full lg:w-2/5 xl:w-1/3 border-r border-gray-200 bg-white flex flex-col h-full">
                {/* Tabs */}
                <div className="flex-none flex border-b border-gray-200">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      activeTab === 'content'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('content')}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FileEditIcon size={18} />
                      Content
                    </span>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      activeTab === 'templates'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('templates')}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LayoutIcon size={18} />
                      Templates
                    </span>
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-auto">
                  {activeTab === 'content' ? (
                    <EditorSidebar resume={resume} />
                  ) : (
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                    />
                  )}
                </div>
              </aside>
            )}

            {/* Preview area */}
            <div className={`flex-1 p-4 md:p-8 overflow-auto bg-white ${previewMode ? 'flex justify-center' : ''}`}>
              <ResumePreview resume={resume} />
            </div>
          </div>
        </main>
      </div>
    </DndContext>
  );
};

export default ResumeBuilder; 
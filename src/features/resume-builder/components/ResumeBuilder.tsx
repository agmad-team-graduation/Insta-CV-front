import React, { useEffect, useState, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FileEditIcon, FileTextIcon, DownloadIcon, LayoutIcon, EyeIcon, Loader2Icon, ArrowLeftIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import useResumeStore from '../store/resumeStore';
import EditorSidebar from './EditorSidebar';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import JobSkillsComparison from './JobSkillsComparison';
import { Input } from "../../../common/components/ui/input";
import PageLoader from "@/common/components/ui/PageLoader";
import { FRONTEND_BASE_URL, PDF_BACKEND_URL } from '@/config';

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
    updateResumeTitle,
    hasUnsavedChanges
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<'content' | 'templates'>('content');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Add ref for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-save when there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && resume && !isSaving) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        saveResume()
          .then(() => {
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 2000);
          });
      }, 3000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, resume, isSaving, saveResume]);

  // Handle Ctrl+S for manual saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (resume && !isSaving) {
          saveResume()
            .then(() => {
              setShowSaveSuccess(true);
              setTimeout(() => setShowSaveSuccess(false), 2000);
            });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resume, isSaving, saveResume]);

  // Replace handleDownloadPdf with Puppeteer backend download
  const downloadResumePdf = async () => {
    if (!resume) return;
    
    try {
      // Show loading state
      const downloadButton = document.querySelector('[title="Download PDF (Server)"]') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = `
          <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        `;
      }

      // Check server health first
      try {
        const healthController = new AbortController();
        const healthTimeoutId = setTimeout(() => healthController.abort(), 5000);
        
        const healthResponse = await fetch(`${PDF_BACKEND_URL}/health`, { 
          signal: healthController.signal 
        });
        
        clearTimeout(healthTimeoutId);
        
        if (!healthResponse.ok) {
          throw new Error('PDF server is not responding');
        }
        const healthData = await healthResponse.json();
        console.log('PDF server health:', healthData);
      } catch (healthError) {
        if (healthError instanceof Error && healthError.name === 'AbortError') {
          throw new Error('PDF server health check timed out. Please ensure the PDF backend server is running on port 3001.');
        }
        throw new Error('PDF server is not available. Please ensure the PDF backend server is running on port 3001.');
      }

      // Get the cookie value dynamically
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('isLoggedIn='))
        ?.split('=')[1];
      
      if (!cookieValue) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Use the preview page URL instead of current page
      const previewUrl = `${FRONTEND_BASE_URL}/resumes/${resume.id}/preview?template=${selectedTemplate}`;
      const pdfUrl = `${PDF_BACKEND_URL}/generate-pdf?url=${encodeURIComponent(previewUrl)}&token=${encodeURIComponent(cookieValue)}`;
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch(pdfUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${resume.id || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        alert('PDF generation timed out. Please try again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to generate PDF: ${errorMessage}`);
      }
    } finally {
      // Reset button state
      const downloadButton = document.querySelector('[title="Download PDF (Server)"]') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Download PDF (Server)';
      }
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
      <PageLoader 
        title="Loading Resume Builder" 
        subtitle="We're preparing your resume editor..."
      />
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

              {/* Preview Button */}
              <button
                onClick={() => window.open(`/resumes/${resume.id}/preview?template=${selectedTemplate}`, '_blank')}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="Preview resume in new tab (Use Ctrl+P for custom print)"
              >
                <EyeIcon size={18} />
                <span className="hidden sm:inline">Preview Page</span>
                <InfoIcon size={14} className="text-gray-500" />
              </button>

              {/* Download PDF (Server) Button */}
              <button
                onClick={downloadResumePdf}
                className="no-print flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="Download PDF (Server)"
              >
                <DownloadIcon size={18} /> Download PDF
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex justify-center items-start py-8 px-60">
          <div className="w-full flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden relative">
            {/* Left sidebar */}
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
              sidebarVisible ? 'lg:w-2/5 xl:w-1/3' : 'w-16'
            }`}>
              {/* Left sidebar toggle button */}
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="w-full h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors border-b border-gray-200"
                title={sidebarVisible ? 'Hide Left Sidebar' : 'Show Left Sidebar'}
              >
                {sidebarVisible ? (
                  <ChevronLeftIcon size={20} className="text-blue-600" />
                ) : (
                  <ChevronRightIcon size={20} className="text-blue-600" />
                )}
              </button>

              {sidebarVisible && (
                <div className="flex flex-col h-full">
                  {/* Tabs */}
                  <div className="flex-none flex border-b border-gray-200">
                    <button
                      className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'content'
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
                      className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'templates'
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
                </div>
              )}
            </div>

            {/* Preview area */}
            <div className={`flex-1 p-4 mt-8 md:p-8 overflow-auto bg-white relative ${!sidebarVisible ? 'flex justify-center' : ''}`}>
              <ResumePreview resume={resume} />
            </div>

            {/* Right sidebar - Job Skills Comparison */}
            <JobSkillsComparison />
          </div>
        </main>
      </div>
    </DndContext>
  );
};

export default ResumeBuilder; 
import { create } from 'zustand';
import { fetchResume, updateResume, generateCV, fetchDemoResume } from '../services/api';
import { Resume, Section, TemplateName, ApiResponse } from '../types';
import apiClient from '../../../common/utils/apiClient';

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  error: string | null;
  selectedTemplate: TemplateName;
  isSaving: boolean;
  isGenerating: boolean;
  generatedResumeId: number | null;
  
  // Actions
  fetchResume: (resumeId?: number) => Promise<void>;
  generateCVForJob: (jobId: number) => Promise<void>;
  clearGeneratedResume: () => void;
  updatePersonalDetails: (details: Partial<Resume['personalDetails']>) => void;
  updateSummary: (summary: string) => void;
  updateSummaryTitle: (newTitle: string) => void;
  updateSectionTitle: (sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>, newTitle: string) => void;
  toggleSectionVisibility: (sectionKey: 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection' | 'personalDetails' | 'summary') => void;
  reorderSections: (newOrder: Record<string, number>) => void;
  reorderItems: <T>(
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    items: T[]
  ) => void;
  updateItem: <T>(
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    itemId: number,
    updatedItem: Partial<T>
  ) => void;
  addItem: <T>(
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    newItem: Omit<T, 'id' | 'orderIndex'>
  ) => void;
  deleteItem: (
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    itemId: number
  ) => void;
  toggleItemVisibility: (
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    itemId: number
  ) => void;
  setSelectedTemplate: (template: TemplateName) => void;
  saveResume: () => Promise<void>;
}

const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  isLoading: false,
  error: null,
  selectedTemplate: 'modern',
  isSaving: false,
  isGenerating: false,
  generatedResumeId: null,

  fetchResume: async (resumeId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const idToFetch = resumeId || get().generatedResumeId;
      if (idToFetch) {
        console.log("fetching resume", idToFetch);
        const resumeData = await fetchResume(idToFetch);
        set({ resume: resumeData, isLoading: false });
      } else {
        console.log("fetching demo resume");
        const resumeData = await fetchDemoResume();
        set({ resume: resumeData, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resume data', 
        isLoading: false 
      });
    }
  },

  updatePersonalDetails: (details) => {
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          personalDetails: {
            ...state.resume.personalDetails,
            ...details
          }
        }
      };
    });
  },

  updateSummary: (summary) => {
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          summary
        }
      };
    });
  },

  updateSummaryTitle: (newTitle) => {
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          summaryTitle: newTitle
        }
      };
    });
  },

  updateSectionTitle: (sectionKey, newTitle) => {
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...state.resume[sectionKey],
            sectionTitle: newTitle
          }
        }
      };
    });
  },

  toggleSectionVisibility: (sectionKey) => {
    set((state) => {
      if (!state.resume) return state;
      if (sectionKey === 'personalDetails') {
        return {
          resume: {
            ...state.resume,
            personalDetails: {
              ...state.resume.personalDetails,
              hidden: !state.resume.personalDetails.hidden
            }
          }
        };
      }
      if (sectionKey === 'summary') {
        return {
          resume: {
            ...state.resume,
            summaryHidden: !state.resume.summaryHidden
          }
        };
      }
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...state.resume[sectionKey],
            hidden: !state.resume[sectionKey].hidden
          }
        }
      };
    });
  },

  reorderSections: (newOrder) => {
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          sectionsOrder: newOrder
        }
      };
    });
  },

  reorderItems: (sectionKey, items) => {
    set((state) => {
      if (!state.resume) return state;
      const updatedItems = items.map((item, index) => ({
        ...item,
        orderIndex: index + 1
      }));
      
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...state.resume[sectionKey],
            items: updatedItems
          }
        }
      };
    });
  },

  updateItem: (sectionKey, itemId, updatedItem) => {
    set((state) => {
      if (!state.resume) return state;
      
      const section = state.resume[sectionKey];
      const updatedItems = section.items.map(item => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      );
      
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...section,
            items: updatedItems
          }
        }
      };
    });
  },

  addItem: (sectionKey, newItem) => {
    set((state) => {
      if (!state.resume) return state;
      
      const section = state.resume[sectionKey];
      const newId = Math.max(0, ...section.items.map(item => item.id)) + 1;
      const newOrderIndex = section.items.length + 1;
      
      const updatedSection = {
        ...section,
        items: [
          ...section.items,
          {
            ...newItem,
            id: newId,
            orderIndex: newOrderIndex
          }
        ]
      };
      
      return {
        resume: {
          ...state.resume,
          [sectionKey]: updatedSection
        }
      };
    });
  },

  deleteItem: (sectionKey, itemId) => {
    set((state) => {
      if (!state.resume) return state;
      
      const section = state.resume[sectionKey];
      const filteredItems = section.items.filter(item => item.id !== itemId);
      
      const reorderedItems = filteredItems.map((item, index) => ({
        ...item,
        orderIndex: index + 1
      }));
      
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...section,
            items: reorderedItems
          }
        }
      };
    });
  },

  toggleItemVisibility: (sectionKey, itemId) => {
    set((state) => {
      if (!state.resume) return state;
      
      const section = state.resume[sectionKey];
      const updatedItems = section.items.map(item => 
        item.id === itemId ? { ...item, hidden: !item.hidden } : item
      );
      
      return {
        resume: {
          ...state.resume,
          [sectionKey]: {
            ...section,
            items: updatedItems
          }
        }
      };
    });
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  saveResume: async () => {
    const { resume } = get();
    if (!resume) return;
    
    set({ isSaving: true, error: null });
    try {
      console.log("saving resume", resume);
      await updateResume(resume.id, resume);
      set({ isSaving: false });
    } catch (error) {
      console.log("error saving resume", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save resume', 
        isSaving: false 
      });
    }
  },

  generateCVForJob: async (jobId: number) => {
    set({ isGenerating: true, error: null });
    try {
      const resumeData = await generateCV(jobId);
      console.log("generated resume", resumeData);
      set({ 
        resume: resumeData, 
        isGenerating: false,
        generatedResumeId: resumeData.id 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate CV', 
        isGenerating: false 
      });
    }
  },

  clearGeneratedResume: () => {
    set({ generatedResumeId: null });
  }
}));

export default useResumeStore; 
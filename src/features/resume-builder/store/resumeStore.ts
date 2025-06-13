import { create } from 'zustand';
import { fetchDemoResume, updateResume } from '../services/api';
import { Resume, Section, TemplateName } from '../types';

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  error: string | null;
  selectedTemplate: TemplateName;
  isSaving: boolean;
  
  // Actions
  fetchResume: (resumeId?: number) => Promise<void>;
  updatePersonalDetails: (details: Partial<Resume['personalDetails']>) => void;
  updateSummary: (summary: string) => void;
  updateSectionTitle: (sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>, newTitle: string) => void;
  toggleSectionVisibility: (sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>) => void;
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
  setSelectedTemplate: (template: TemplateName) => void;
  saveResume: () => Promise<void>;
}

const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  isLoading: false,
  error: null,
  selectedTemplate: 'modern',
  isSaving: false,

  fetchResume: async (resumeId?: number) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, use fetchResume(resumeId) instead
      const resumeData = await fetchDemoResume();
      set({ resume: resumeData, isLoading: false });
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
      // Update orderIndex based on new order
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
      
      // Reorder the remaining items
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

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  saveResume: async () => {
    const { resume } = get();
    if (!resume) return;
    
    set({ isSaving: true, error: null });
    try {
      await updateResume(resume.id, resume);
      set({ isSaving: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save resume', 
        isSaving: false 
      });
    }
  }
}));

export default useResumeStore; 
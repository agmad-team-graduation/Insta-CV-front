import { create } from 'zustand';
import { fetchResume, updateResume, generateCV, createCV } from '../services/api';
import { Resume, Section, TemplateName, ApiResponse } from '../types';
import apiClient from '../../../common/utils/apiClient';
import { toast } from 'sonner';

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  error: string | null;
  selectedTemplate: TemplateName;
  isSaving: boolean;
  isGenerating: boolean;
  
  // Actions
  fetchResume: (resumeId?: number) => Promise<void>;
  createNewResume: () => Promise<number>;
  generateCVForJob: (jobId: number) => Promise<number>;
  updatePersonalDetails: (details: Partial<Resume['personalDetails']>) => void;
  updateSummary: (summary: string) => void;
  updateSummaryTitle: (newTitle: string) => void;
  updateResumeTitle: (newTitle: string) => Promise<void>;
  updateSectionTitle: (sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>, newTitle: string) => void;
  toggleSectionVisibility: (sectionKey: 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection' | 'personalDetails' | 'summarySection') => void;
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
  ) => Promise<void>;
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

  fetchResume: async (resumeId?: number) => {
    if (!resumeId) return;
    set({ isLoading: true, error: null });
    try {
      const resumeData = await fetchResume(resumeId);
      set({ resume: resumeData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resume data', 
        isLoading: false 
      });
    }
  },

  createNewResume: async (createEmpty: boolean = false): Promise<number> => {
    set({ isLoading: true, error: null });
    try {
      const resumeData = await createCV(createEmpty);
      set({ resume: resumeData, isLoading: false });
      return resumeData.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create new resume', 
        isLoading: false 
      });
      throw error;
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
          summarySection: {
            ...state.resume.summarySection,
            summary
          }
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
          summarySection: {
            ...state.resume.summarySection,
            sectionTitle: newTitle
          }
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

      // Create a new sectionsOrder object with updated orderIndex values
      const updatedSectionsOrder = Object.entries(newOrder).reduce((acc, [sectionKey, newIndex]) => {
        acc[sectionKey] = newIndex;
        return acc;
      }, {} as Record<string, number>);

      // Update each section's orderIndex in the resume object
      const updatedResume = {
        ...state.resume,
        sectionsOrder: updatedSectionsOrder,
        summarySection: {
          ...state.resume.summarySection,
          orderIndex: updatedSectionsOrder.summary || state.resume.summarySection.orderIndex
        },
        educationSection: {
          ...state.resume.educationSection,
          orderIndex: updatedSectionsOrder.education || state.resume.educationSection.orderIndex
        },
        experienceSection: {
          ...state.resume.experienceSection,
          orderIndex: updatedSectionsOrder.experience || state.resume.experienceSection.orderIndex
        },
        skillSection: {
          ...state.resume.skillSection,
          orderIndex: updatedSectionsOrder.skill || state.resume.skillSection.orderIndex
        },
        projectSection: {
          ...state.resume.projectSection,
          orderIndex: updatedSectionsOrder.project || state.resume.projectSection.orderIndex
        }
      };

      // Save the changes to the backend
      updateResume(updatedResume.id, updatedResume).catch(error => {
        console.error('Error saving section order:', error);
        toast.error('Failed to save section order');
      });

      return { resume: updatedResume };
    });
  },

  reorderItems: (sectionKey, items) => {
    set((state) => {
      if (!state.resume) return state;

      // Update items with new orderIndex values
      const updatedItems = items.map((item, index) => ({
        ...item,
        orderIndex: index + 1
      }));
      
      // Update the section with new items and their order
      const updatedResume = {
        ...state.resume,
        [sectionKey]: {
          ...state.resume[sectionKey],
          items: updatedItems
        }
      };

      // Save the changes to the backend
      updateResume(updatedResume.id, updatedResume).catch(error => {
        console.error('Error saving items order:', error);
        toast.error('Failed to save items order');
      });
      
      return { resume: updatedResume };
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

  addItem: async <T>(
    sectionKey: keyof Pick<Resume, 'educationSection' | 'experienceSection' | 'skillSection' | 'projectSection'>,
    newItem: Omit<T, 'id' | 'orderIndex'>
  ) => {
    const { resume } = get();
    if (!resume) return;
    
    const section = resume[sectionKey];
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
    
    const updatedResume = {
      ...resume,
      [sectionKey]: updatedSection
    };

    // Update local state immediately
    set({ resume: updatedResume });

    // Save the changes to the backend
    try {
      await updateResume(updatedResume.id, updatedResume);
    } catch (error) {
      console.error('Error saving new item:', error);
      toast.error('Failed to save new item');
      throw error;
    }
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
      
      const updatedResume = {
        ...state.resume,
        [sectionKey]: {
          ...section,
          items: updatedItems
        }
      };

      // Save the changes to the backend
      updateResume(updatedResume.id, updatedResume).catch(error => {
        console.error('Error saving item visibility:', error);
        toast.error('Failed to save item visibility');
      });
      
      return { resume: updatedResume };
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
      console.log("error saving resume", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save resume', 
        isSaving: false 
      });
    }
  },

  generateCVForJob: async (jobId: number): Promise<number> => {
    set({ isGenerating: true, error: null });
    try {
      const resumeData = await generateCV(jobId);
      set({ 
        resume: resumeData, 
        isGenerating: false
      });
      return resumeData.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate CV', 
        isGenerating: false 
      });
      throw error;
    }
  },

  updateResumeTitle: async (newTitle: string) => {
    const { resume } = get();
    if (!resume) return;

    try {
      const response = await apiClient.put(`/api/v1/cv/update-title?cvId=${resume.id}&title=${encodeURIComponent(newTitle)}`);
      set((state) => ({
        resume: {
          ...state.resume!,
          cvTitle: response.data.cvTitle
        }
      }));
      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
      throw error;
    }
  },
}));

export default useResumeStore; 
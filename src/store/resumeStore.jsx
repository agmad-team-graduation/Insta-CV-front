import { create } from 'zustand';
import { fetchDemoResume, updateResume } from '../services/api';

const useResumeStore = create((set, get) => ({
  resume: null, // The resume object itself
  isLoading: false, // Whether data is loading
  error: null, // Any error encountered
  selectedTemplate: 'modern', // The template selected
  isSaving: false, // Whether the resume is being saved

  // Fetch resume (no types)
  fetchResume: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating the API call to fetch demo data
      const resumeData = await fetchDemoResume();
      set({ resume: resumeData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resume data', 
        isLoading: false 
      });
    }
  },

  // Update personal details
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

  // Update summary
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

  // Update section title
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

  // Toggle section visibility
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

  // Reorder sections
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

  // Reorder items within a section
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

  // Update an item in a section
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

  // Add a new item to a section
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

  // Delete an item from a section
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

  // Set the selected template
  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  // Save the resume
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

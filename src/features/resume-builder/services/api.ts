import { ApiResponse, Resume } from '../types';
import apiClient from '../../../common/utils/apiClient';

/**
 * Create a new CV
 */
export const createCV = async (createEmptyCv: boolean = false): Promise<Resume> => {
  try {
    const response = await apiClient.post<Resume>('/api/v1/cv/create', {createEmptyCv});
    return response.data;
  } catch (error) {
    console.error('Error creating CV:', error);
    throw error;
  }
};

/**
 * Fetch resume data by ID
 */
export const fetchResume = async (resumeId: number): Promise<Resume> => {
  try {
    const response = await apiClient.get<Resume>(`/api/v1/cv/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

/**
 * Update resume data
 */
export const updateResume = async (resumeId: number, resumeData: Resume): Promise<Resume> => {
  try {
    const response = await apiClient.put<Resume>(`/api/v1/cv/${resumeId}`, resumeData);
    return response.data;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

/**
 * Generate a CV for a specific job
 */
export const generateCV = async (jobId: number): Promise<Resume> => {
  try {
    const response = await apiClient.post<Resume>('/api/v1/cv/generate', { jobId });
    console.log("generated resume", response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};
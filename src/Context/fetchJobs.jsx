import apiClient from '../utils/apiClient';

export const fetchJobs = async (page, size) => {
  try {
    const response = await apiClient.get(`/api/v1/jobs/all?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { content: [], totalPages: 0 }; 
  }
};

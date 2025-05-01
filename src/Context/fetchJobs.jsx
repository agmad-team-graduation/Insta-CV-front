import apiClient from '../utils/apiClient';

export const fetchJobs = async () => {
  try {
    const response = await apiClient.get('/api/v1/jobs/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

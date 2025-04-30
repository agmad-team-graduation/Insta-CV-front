import apiClient from '../utils/apiClient';

export const fetchJobs = async (token) => {
  try {
    const response = await apiClient.get('/api/v1/jobs/all', {
      headers: {
        'Authorization': `Bearer ${token || ''}`,
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};
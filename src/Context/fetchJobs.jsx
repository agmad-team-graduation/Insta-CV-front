export const fetchJobs = async (token) => {
    try {
      const response = await fetch('/api/v1/jobs/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };
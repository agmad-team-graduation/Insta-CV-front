// src/utils/apiClient.js
import axios from 'axios';
import API_BASE_URL from '@/config';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const apiClient = axios.create({
  baseURL: API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to dynamically include the token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from cookies on each request
    const token = cookies.get('isLoggedIn');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

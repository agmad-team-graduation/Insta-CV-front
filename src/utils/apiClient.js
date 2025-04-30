// src/utils/apiClient.js
import axios from 'axios';
import API_BASE_URL from '@/config';

/**
 * A centralized HTTP client for interacting with the API.
 * Automatically applies the base URL and JSON headers to every request.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

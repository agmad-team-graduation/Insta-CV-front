// Frontend configuration
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin;

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// PDF Backend configuration
const PDF_BACKEND_URL = import.meta.env.VITE_PDF_BACKEND_URL || 'http://localhost:3001';

export {
  FRONTEND_BASE_URL,
  API_BASE_URL,
  PDF_BACKEND_URL
};

export default API_BASE_URL;
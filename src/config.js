const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PDF_BACKEND_URL = import.meta.env.VITE_PDF_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

export default API_BASE_URL;
export { PDF_BACKEND_URL, FRONTEND_URL };

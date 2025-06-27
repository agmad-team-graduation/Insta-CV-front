import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString, presentText = 'Present') => {
  if (!dateString) return '';
  
  try {
    // For present dates
    if (dateString === 'present') return presentText;
    
    const date = parseISO(dateString);
    return format(date, 'MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format date range for display
 */
export const formatDateRange = (startDate, endDate, isPresent) => {
  const formattedStart = formatDate(startDate);
  const formattedEnd = isPresent ? 'Present' : formatDate(endDate);
  
  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * Get skill level as visual representation
 */
export const getSkillLevelBars = (level) => {
  const levels = {
    'BEGINNER': 1,
    'INTERMEDIATE': 2,
    'ADVANCED': 3,
    'EXPERT': 4
  };
  
  const levelValue = levels[level] || 0;
  return '●'.repeat(levelValue) + '○'.repeat(4 - levelValue);
};

/**
 * Get CSS class for skill level
 */
export const getSkillLevelClass = (level) => {
  const levels = {
    'BEGINNER': 'bg-blue-100 text-blue-800',
    'INTERMEDIATE': 'bg-green-100 text-green-800',
    'ADVANCED': 'bg-purple-100 text-purple-800',
    'EXPERT': 'bg-orange-100 text-orange-800'
  };
  
  return levels[level] || 'bg-gray-100 text-gray-800';
};

/**
 * Convert snake_case or camelCase to Title Case
 */
export const toTitleCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to spaces
    .replace(/_/g, ' ') // Convert snake_case to spaces
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};
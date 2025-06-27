import React from 'react';
import { Loader2 } from 'lucide-react';

const ComponentLoader = ({ 
  message = "Loading...",
  size = "default" // "small", "default"
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6"
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default ComponentLoader; 
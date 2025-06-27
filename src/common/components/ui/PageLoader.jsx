import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ 
  title = "Loading...", 
  subtitle = "Please wait while we prepare your content",
  size = "default" // "small", "default", "large"
}) => {
  const sizeClasses = {
    small: "h-8 w-8",
    default: "h-12 w-12", 
    large: "h-16 w-16"
  };

  const containerClasses = {
    small: "min-h-[200px]",
    default: "min-h-screen",
    large: "min-h-screen"
  };

  return (
    <div className={`${containerClasses[size]} flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30`}>
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className={`${sizeClasses[size]} mx-auto relative`}>
            {/* Main spinning loader */}
            <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 animate-pulse">
            {title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader; 
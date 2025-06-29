import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface DeleteTooltipProps {
  onDelete: () => void;
  itemName?: string;
  className?: string;
}

const DeleteTooltip: React.FC<DeleteTooltipProps> = ({ 
  onDelete, 
  itemName, 
  className = "" 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onDelete();
    setShowTooltip(false);
  };

  const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative" ref={tooltipRef}>
      <button
        onClick={handleToggleTooltip}
        className={`text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200 ${className}`}
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
      
      {showTooltip && (
        <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Delete {itemName ? `"${itemName}"` : 'item'}?
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTooltip(false)}
              className="flex-1 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteTooltip; 
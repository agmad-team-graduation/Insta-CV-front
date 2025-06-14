import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  handleClassName?: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  className = '',
  handleClassName = '',
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 cursor-grabbing' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default DraggableItem; 
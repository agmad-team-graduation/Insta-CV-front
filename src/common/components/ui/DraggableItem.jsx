import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

function DraggableItem({
  id,
  children,
  className = '',
  handleClassName = '',
}) {
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
      className={`${className} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="flex items-start">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab hover:text-blue-600 active:cursor-grabbing p-2 touch-none ${handleClassName}`}
        >
          <GripVertical size={20} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export default DraggableItem;
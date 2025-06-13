import React, { PropsWithChildren } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableContainerProps {
  id: string;
  className?: string;
}

const DroppableContainer: React.FC<PropsWithChildren<DroppableContainerProps>> = ({
  id,
  children,
  className = '',
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'drop-indicator' : ''}`}
      data-droppable-id={id}
    >
      {children}
    </div>
  );
};

export default DroppableContainer; 
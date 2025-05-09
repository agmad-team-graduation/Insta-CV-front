import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function DroppableContainer({
  id,
  children,
  className = '',
}) {
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
}

export default DroppableContainer;
"use client";

import { useEffect, useRef, ReactNode } from "react";

interface DraggableItemProps {
  children: ReactNode;
  id: string | number;
  x: number;
  y: number;
  onDrag: (id: string | number, x: number, y: number) => void;
}

export default function DraggableItem({ children, id, x, y, onDrag }: DraggableItemProps) {
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0 });
  const nodeRef = useRef<HTMLDivElement>(null); // Ref to measure the node itself

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX - x,
      mouseY: e.clientY - y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !nodeRef.current) return;
      
      const parent = nodeRef.current.parentElement;
      if (!parent) return;

      // 1. Calculate the "raw" new position based on mouse
      let newX = e.clientX - dragStart.current.mouseX;
      let newY = e.clientY - dragStart.current.mouseY;

      // 2. Get dimensions for clamping
      const parentRect = parent.getBoundingClientRect();
      const nodeRect = nodeRef.current.getBoundingClientRect();

      // 3. Clamp X (0 to ParentWidth - NodeWidth)
      const maxX = parentRect.width - nodeRect.width;
      newX = Math.max(0, Math.min(newX, maxX));

      // 4. Clamp Y (0 to ParentHeight - NodeHeight)
      const maxY = parentRect.height - nodeRect.height;
      newY = Math.max(0, Math.min(newY, maxY));
      
      // 5. Update parent state
      onDrag(id, newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Attach to window so you don't lose drag if mouse moves fast
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, onDrag]); 

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="absolute left-0 top-0 w-fit touch-none cursor-grab active:cursor-grabbing hover:z-50 active:z-50"
    >
      {children}
    </div>
  );
}
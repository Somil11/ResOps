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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    isDragging.current = true;
    // Record where we clicked relative to the item's current position
    dragStart.current = {
      mouseX: e.clientX - x,
      mouseY: e.clientY - y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      // Calculate new position
      const newX = e.clientX - dragStart.current.mouseX;
      const newY = e.clientY - dragStart.current.mouseY;
      
      // Tell the parent component!
      onDrag(id, newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, onDrag]); // We don't include x/y here to avoid re-attaching listeners constantly

  return (
    <div
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
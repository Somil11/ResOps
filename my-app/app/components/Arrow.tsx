"use client";

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}

export default function Arrow({ 
  x1, 
  y1, 
  x2, 
  y2, 
  color = "#94a3b8" // Default color (Slate-400)
}: ArrowProps) {
  
  // Calculate offsets to center the line on the cards
  // Assuming card width ~192px (w-48) and height ~160px
  const startX = x1 + 96; 
  const startY = y1 + 80;
  const endX = x2;
  const endY = y2 + 80;

  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible z-0">
      <defs>
        {/* Define the Arrowhead shape here */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10" // Adjusts how far the arrow sits from the end of the line
          refY="3.5" // The center Y point of the arrow shape (half of 7)
          orient="auto" // Rotates the arrow automatically to match the line angle
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
      </defs>

      {/* The Line itself */}
      <line
        x1={startX}
        y1={startY}
        x2={endX-1}
        y2={endY-2}
        stroke={color}
        strokeWidth="2"
        markerEnd="url(#arrowhead)" // <--- This attaches the marker defined above
      />
    </svg>
  );
}
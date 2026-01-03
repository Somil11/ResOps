"use client";

import { useEffect, useState } from "react";
import NodeCard from "../components/NodeCard";
import DraggableItem from "../components/DraggableItem";
import Arrow from "../components/Arrow"; // Import the arrow

type NodeType = {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
};

export default function UserJourneyPage() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch and initialize positions
  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch("/api/nodes");
        const data = await res.json();
        if (data?.nodes) {
          const nodesWithPos = data.nodes.map((n: any, i: number) => ({
            ...n,
            // Simple grid layout math
            x: (i % 4) * 250 + 50,
            y: Math.floor(i / 4) * 250 + 50,
          }));
          setNodes(nodesWithPos);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNodes();
  }, []);

  // 2. Handle Drag Updates
  const handleDrag = (id: string | number, newX: number, newY: number) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, x: newX, y: newY } : node))
    );
  };

  // 3. Logic to define connections (Example: Frontend -> Backend)
  // Find the first node of each category to connect
  const sourceNode1 = nodes.find((n) => n.category === "frontend");
  const targetNode1 = nodes.find((n) => n.category === "backend");
  const sourceNode2 = nodes.find((n) => n.category === "backend");
  const targetNode2 = nodes.find((n) => n.category === "databases");


  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">User Journey Map</h1>

      {/* CANVAS */}
      <div className="relative h-[80vh] w-full overflow-hidden rounded-xl ">
        
        {/* ARROW LAYER (Must come before nodes so it sits behind them) */}
        {sourceNode1 && targetNode1 && (
          <Arrow 
            x1={sourceNode1.x} 
            y1={sourceNode1.y} 
            x2={targetNode1.x} 
            y2={targetNode1.y} 
          />
        )}
        {sourceNode2 && targetNode2 && (
          <Arrow 
            x1={sourceNode2.x} 
            y1={sourceNode2.y} 
            x2={targetNode2.x} 
            y2={targetNode2.y} 
          />
        )}

        {/* DRAGGABLE NODES */}
        {!loading && nodes.map((node) => (
          <DraggableItem
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            onDrag={handleDrag}
          >
            <NodeCard id={node.id} name={node.name} category={node.category} />
          </DraggableItem>
        ))}
      </div>
    </div>
  );
}
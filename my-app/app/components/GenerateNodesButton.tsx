"use client";

import { useState } from "react";

interface GenerateProps {
  onNodesGenerated?: () => void; // Optional callback
}

export default function GenerateNodesButton({ onNodesGenerated }: GenerateProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/nodes/generate", { method: "POST" });
      const data = await res.json();
      
      if (data?.nodes) {
        // If a callback is provided (like fetchNodes), call it
        if (onNodesGenerated) {
          onNodesGenerated();
        } else {
          // Fallback to reload if no callback provided
          window.location.reload();
        }
      } else {
        alert("No nodes created");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate nodes");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleClick} 
      disabled={loading} 
      className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate Nodes"}
    </button>
  );
}
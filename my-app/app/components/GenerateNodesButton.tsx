"use client";

import { useState } from "react";

export default function GenerateNodesButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/nodes/generate", { method: "POST" });
      const data = await res.json();
      if (data?.nodes) {
        alert(`Generated ${data.nodes.length} nodes`);
        window.location.reload();
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
    <button onClick={handleClick} disabled={loading} className="rounded bg-gray-800 px-3 py-1 text-sm text-white">
      {loading ? "Generating..." : "Generate Nodes"}
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";

// 1. Move interface outside the component
interface GenerateProps {
  onNodesGenerated?: () => void;
}

// 2. Accept props in the function signature
export default function CenteredForm({ onNodesGenerated }: GenerateProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 3. Handle localStorage safely on the client side only
  useEffect(() => {
    const uidKey = "resops_user_id";
    let storedId = localStorage.getItem(uidKey);
    
    if (!storedId) {
      storedId = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem(uidKey, storedId);
    }
    setUserId(storedId);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || !userId) return; // Prevent empty submits
    
    setLoading(true);

    try {
      // Step 1: Submit Form Data
      const submitRes = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, userId }),
      });

      if (!submitRes.ok) throw new Error("Network error during submission");
      
      const submitData = await submitRes.json();
      console.log("Saved:", submitData.item);
      setValue(""); // Clear input immediately on success

      // Step 2: Generate Nodes
      const nodesRes = await fetch("/api/nodes", { method: "POST" });
      const nodesData = await nodesRes.json();

      if (nodesData?.nodes) {
        if (onNodesGenerated) {
          onNodesGenerated(); // Call parent refresher
        } else {
          window.location.reload(); // Fallback
        }
      } else {
        alert("No nodes created");
      }

    } catch (e) {
      console.error(e);
      alert("Failed to process request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-3 px-4">
        <input
          name="text"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          placeholder="Enter text..."
          className="min-w-0 flex-1 rounded-md border border-black/[0.08] bg-white px-6 py-3 text-base outline-none disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#0b0b0b] dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-full bg-black px-5 py-3 text-white transition-opacity hover:bg-[#222] disabled:opacity-50 dark:bg-zinc-50 dark:text-black"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
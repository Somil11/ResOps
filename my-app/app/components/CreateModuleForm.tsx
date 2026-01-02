"use client";

import { useState } from "react";

export default function CreateModuleForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: any) {
    e?.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data?.module) {
        setName("");
        onCreated?.();
        alert(`Created module: ${data.module.name}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create module");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border bg-white p-4 dark:bg-[#050505]">
      <h3 className="mb-2 text-lg font-medium">Create Module</h3>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Module name" className="w-full rounded border px-2 py-1 text-sm" />
        <button type="submit" disabled={loading} className="rounded bg-black px-3 py-1 text-sm text-white">
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}

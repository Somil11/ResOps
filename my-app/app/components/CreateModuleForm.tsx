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
      const res = await fetch("/api/module", {
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
    <form onSubmit={handleSubmit} className="group flex aspect-square flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-[#0A0A0A] dark:hover:border-zinc-700">
      <h3 className="mb-2 text-lg font-medium">Create Module</h3>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Module name" className="w-full rounded border px-2 py-1 text-sm" /></div>
        <div><button type="submit" disabled={loading} className="rounded bg-black px-3 py-1 text-sm text-white">
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}

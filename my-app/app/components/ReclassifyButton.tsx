"use client";

import { useState } from "react";

export default function ReclassifyButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/reclassify", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setMsg(`Updated ${data.updated}/${data.total}`);
      // reload page to reflect changes
      setTimeout(() => location.reload(), 800);
    } catch (e: any) {
      setMsg(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={run}
        disabled={loading}
        className="rounded-md bg-foreground px-3 py-2 text-sm text-background disabled:opacity-60"
      >
        {loading ? "Reclassifying..." : "Reclassify All"}
      </button>
      {msg ? <div className="mt-2 text-sm text-zinc-600">{msg}</div> : null}
    </div>
  );
}

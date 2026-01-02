"use client";

import { useState } from "react";

export default function EditableCell({ id, field, value, placeholder }: { id: number; field: string; value?: string; placeholder?: string }) {
  const [val, setVal] = useState(value ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(newVal: string) {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value: newVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "save failed");
      setMsg("Saved");
      setTimeout(() => setMsg(null), 1200);
    } catch (e: any) {
      setMsg(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="w-full rounded border px-2 py-1 text-sm"
        value={val}
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
        onBlur={(e) => save(e.target.value)}
      />
      <div className="w-16 text-xs text-zinc-500">{saving ? "…" : msg}</div>
    </div>
  );
}

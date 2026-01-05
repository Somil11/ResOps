"use client";

import { useState } from "react";

export default function EditableCell({
  id,
  field,
  value,
  placeholder,
}: {
  id: number;
  field: string;
  value?: string;
  placeholder?: string;
}) {
  const [val, setVal] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false); // New state for toggle
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value: val }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "save failed");
      
      setMsg("Saved");
      setIsEditing(false); // Return to static mode on success
      setTimeout(() => setMsg(null), 1200);
    } catch (e: any) {
      setMsg(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  const handleToggle = () => {
    if (isEditing) {
      // If currently editing, clicking checks/saves the data
      save();
    } else {
      // If currently static, clicking enables edit mode
      setIsEditing(true);
    }
  };

  // Handle Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      save();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 min-h-[32px]">
      {/* Conditional Rendering: Input vs Static Text */}
      {isEditing ? (
        <input
          autoFocus
          className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-black dark:focus:border-white"
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="text-sm px-2 py-1 truncate cursor-text" onClick={() => setIsEditing(true)}>
          {val || <span className="text-zinc-400 italic">{placeholder}</span>}
        </span>
      )}

      <div className="flex items-center gap-2">
        {/* Status Message */}
        {msg && <span className="text-xs text-green-600">{msg}</span>}
        
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={saving}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title={isEditing ? "Save" : "Edit"}
        >
          {saving ? (
            // Loading Spinner
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ) : isEditing ? (
            // Check (Save) Icon
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            // Pencil (Edit) Icon
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
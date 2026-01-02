"use client";

import { useEffect, useState } from "react";

export default function ModuleList() {
  const [modules, setModules] = useState<Array<{ id: number; name: string; createdAt: string }>>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const res = await fetch("/api/modules");
      const data = await res.json();
      if (data?.modules) setModules(data.modules);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="rounded-md border bg-white p-4 dark:bg-[#050505]">
      <h3 className="mb-2 text-lg font-medium">Existing Modules</h3>
      {modules.length === 0 ? (
        <div className="text-sm text-zinc-600">No modules yet.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {modules.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded px-3 py-2 hover:bg-black/[0.02]">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-zinc-500">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <a href={`/modules/${m.id}`} className="text-sm text-indigo-600">Open</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

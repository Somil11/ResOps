"use client";

import Link from "next/link";
import { useState } from "react";

export default function ModuleListToggle({ initialModules = [] }: { initialModules?: any[] }) {
  const [open, setOpen] = useState(false);
  const [modules] = useState(initialModules);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-md bg-gray-100 text-sm hover:bg-gray-200 dark:bg-white/3 dark:hover:bg-white/5"
      >
        Modules {modules.length ? `(${modules.length})` : ""}
      </button>

      {open ? (
        <div className="absolute left-0 top-10 z-50 w-64 rounded-md border bg-white p-3 shadow-lg dark:bg-[#0b0b0b]">
          {modules.length === 0 ? (
            <div className="text-sm text-zinc-600">No modules</div>
          ) : (
            <ul className="flex max-h-60 flex-col gap-2 overflow-auto">
              {modules.map((m: any) => (
                <li key={m.id} className="text-sm">
                  <Link href={`/modules/${m.id}`} className="block px-2 py-1 hover:bg-black/[0.03]">{m.name}</Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 text-right">
            <button onClick={() => setOpen(false)} className="text-sm text-zinc-500">Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

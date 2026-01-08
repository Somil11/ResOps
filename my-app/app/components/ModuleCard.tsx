"use client";

import { useEffect, useState } from "react";

export default function ModuleList() {
  const [modules, setModules] = useState<Array<{ id: number; name: string; path:String, createdAt: string }>>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const res = await fetch("/api/module");
      const data = await res.json();
      if (data?.modules) setModules(data.modules);
    } catch (e) {
      console.error(e);
    }
  }

  return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {modules.map((m) => (
                <a key={m.id}href={`/modules/${m.path}`}>
              <li
                key={m.id}
                className="group relative flex aspect-square flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-[#0A0A0A] dark:hover:border-zinc-700"
              >
                {/* Top Section: ID & Hidden Actions */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] text-zinc-400">
                    #{m.id}
                  </span>
                  
                  {/* Edit Button (Visible on Hover) */}
                  <button className="opacity-0 transition-opacity hover:text-blue-500 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                </div>
                

                {/* Bottom Section: Info */}
                <div>
                  <h4 className="line-clamp-2 font-semibold leading-tight text-zinc-800 dark:text-zinc-200">
                    {m.name}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(m.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </li></a>
            ))}
          </ul>
  );
}
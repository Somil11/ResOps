"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Module = {
  id: number;
  name: string;
  path: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [modules, setModules] = useState<Module[]>([]);

  // Fetch dynamic modules on mount
  useEffect(() => {
    fetch("/api/modules")
      .then((res) => res.json())
      .then((data) => {
        if (data.modules) {
          setModules(data.modules);
        }
      })
      .catch((err) => console.error("Failed to load modules:", err));
  }, []);

  // Helper to determine styling for active vs inactive links
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const base = "block rounded-md px-3 py-2 transition-colors";
    const active = "bg-black/[0.04] font-medium text-black dark:bg-white/[0.02] dark:text-white";
    const inactive = "hover:bg-black/[0.04] dark:hover:bg-white/[0.02]";
    
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <aside className="hidden w-48 shrink-0 border-r border-black/[0.06] bg-white px-4 py-6 dark:border-white/[0.06] dark:bg-[#050505] sm:block">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Link href="/module">Modules</Link>
        </div>
        
        <ul className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">

          {/* Visual Separator (only shows if custom modules exist) */}
          {modules.length > 0 && (
            <li className="my-2 h-px bg-zinc-100 dark:bg-zinc-800" />
          )}

          {/* Dynamic Modules from API */}
          {modules.map((mod) => (
            <li key={mod.id}>
              <Link className={getLinkClass(mod.path)} href={'/modules/' + mod.path}>
                {mod.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
"use client";

interface NodeCardProps {
  id: string | number;
  name: string;
  category: string;
}

export default function NodeCard({ id, name, category }: NodeCardProps) {
  return (
    // Changed w-48 to w-36 (144px) and p-4 to p-3
    <div className="group relative flex aspect-square w-36 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-[#0A0A0A] dark:hover:border-zinc-700">
      
      {/* Top Section: ID & Hidden Actions */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-[9px] text-zinc-400">
          #{id}
        </span>
        
        {/* Edit Button (Visible on Hover) */}
        <button className="opacity-0 transition-opacity hover:text-blue-500 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
      </div>

      {/* Center Visual (Placeholder icon) - Reduced size */}
      <div className="flex flex-1 items-center justify-center opacity-10">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4"/><path d="M8 12h8"/></svg>
      </div>

      {/* Bottom Section: Info - Reduced text sizes */}
      <div>
        <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-zinc-800 dark:text-zinc-200 select-none">
          {name}
        </h4>
        <p className="mt-0.5 text-[10px] text-zinc-500 capitalize">
          {category}
        </p>
      </div>
    </div>
  );
}
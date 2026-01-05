export default function Sidebar() {
  return (
    // Changed w-64 to w-48
    <aside className="hidden w-48 shrink-0 border-r border-black/[0.06] bg-white px-4 py-6 dark:border-white/[0.06] dark:bg-[#050505] sm:block">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <a href="/modules">Modules</a></div>
        <ul className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <a className="block rounded-md px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.02]" href="/user-journey">User Journey</a>
          </li>
          <li>
            <a className="block rounded-md px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.02]" href="/data-journey">Data Journey</a>
          </li>
          <li>
            <a className="block rounded-md px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.02]" href="/security">Security</a>
          </li>
          <li>
            <a className="block rounded-md px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.02]" href="/integrations">Integrations</a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-black/[0.06] bg-white dark:bg-[#0b0b0b] dark:border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-black/[0.08] dark:bg-white/[0.08]" />
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">ResOps</span>
        </Link>
        <nav className="text-sm text-zinc-600 dark:text-zinc-400">
          <a className="mr-4 hover:underline" href="#">Overview</a>
          <a className="mr-4 hover:underline" href="#">Projects</a>
          <a className="hover:underline" href="#">Settings</a>
        </nav>
      </div>
    </header>
  );
}

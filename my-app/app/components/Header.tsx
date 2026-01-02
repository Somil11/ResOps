import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/60 backdrop-blur-lg dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500" />
          <div className="font-medium">ResOps</div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="px-3 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.02]">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

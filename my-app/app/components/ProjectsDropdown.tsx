"use client";

import { useEffect, useState } from "react";

export default function ProjectsDropdown() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data?.projects) setProjects(data.projects);
    } catch (e) {
      console.error(e);
    }
  }

  async function createProject() {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (data?.project) {
        setProjects((p) => [data.project, ...p]);
        setNewName("");
        setOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="px-3 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.02]">
        Projects
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-md border bg-white p-3 shadow-lg dark:bg-[#0b0b0b]">
          <div className="max-h-60 overflow-auto">
            {projects.length === 0 ? (
              <div className="text-sm text-zinc-600">No projects</div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="px-2 py-2 text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <a href={`/projects/${p.id}`}>{p.name}</a>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 border-t pt-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New project name"
              className="w-full rounded border px-2 py-1 text-sm"
            />
            <div className="mt-2 flex items-center justify-between">
              <button onClick={createProject} disabled={loading} className="rounded bg-black px-3 py-1 text-sm text-white">
                {loading ? "Creating..." : "+ New Project"}
              </button>
              <button onClick={() => setOpen(false)} className="text-sm text-zinc-500">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
import fs from "fs/promises";
import path from "path";
import dynamic from "next/dynamic";
import ReclassifyButton from "../components/ReclassifyButton";
import EditableCell from "../components/EditableCell";

type Item = {
  id: number;
  text: string;
  forAI: string;
  classification?: {
    frontend?: string[];
    backend?: string[];
    devops?: string[];
    databases?: string[];
    tools?: string[];
  };
  createdAt: string;
};

async function getSubmissions(): Promise<Item[]> {
  const file = path.join(process.cwd(), "data", "submissions.json");
  try {
    const content = await fs.readFile(file, "utf8");
    return JSON.parse(content) as Item[];
  } catch (e) {
    return [];
  }
}

export default async function AdminPage() {
  const submissions = await getSubmissions();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Admin — Submissions</h1>
      <div className="mb-4">
        <ReclassifyButton />
      </div>
      {submissions.length === 0 ? (
        <div className="text-sm text-zinc-600">No submissions yet.</div>
      ) : (
        <div className="overflow-hidden rounded-md border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#050505]">
          <table className="w-full table-auto text-left">
            <thead className="bg-black/[0.02] text-sm dark:bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Text</th>
                <th className="px-4 py-3">Frontend</th>
                <th className="px-4 py-3">Backend</th>
                <th className="px-4 py-3">DevOps</th>
                <th className="px-4 py-3">Databases</th>
                <th className="px-4 py-3">Tools</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-t border-black/[0.04] dark:border-white/[0.03] align-top text-sm">
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3 break-words max-w-[30rem]">
                    <EditableCell id={s.id} field="text" value={s.text} placeholder="Text" />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell id={s.id} field="classification.frontend" value={s.classification?.frontend?.join(", ") || ""} placeholder="Frontend" />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell id={s.id} field="classification.backend" value={s.classification?.backend?.join(", ") || ""} placeholder="Backend" />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell id={s.id} field="classification.devops" value={s.classification?.devops?.join(", ") || ""} placeholder="DevOps" />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell id={s.id} field="classification.databases" value={s.classification?.databases?.join(", ") || ""} placeholder="Databases" />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell id={s.id} field="classification.tools" value={s.classification?.tools?.join(", ") || ""} placeholder="Tools" />
                  </td>
                  <td className="px-4 py-3">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

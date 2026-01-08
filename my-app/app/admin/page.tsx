import React from "react";
import fs from "fs/promises";
import path from "path";
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

// Define the categories we want to display as separate tables
const CATEGORIES = ["frontend", "backend", "devops", "databases", "tools"] as const;

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Submissions</h1>
        <ReclassifyButton />
      </div>

      {submissions.length === 0 ? (
        <div className="text-sm text-zinc-600">No submissions yet.</div>
      ) : (
        <div className="space-y-12">
          {CATEGORIES.map((category) => (
            <section key={category} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold capitalize text-zinc-800 dark:text-zinc-100">
                {category} Data
              </h2>
              
              <div className="overflow-hidden rounded-md border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#050505]">
                <table className="w-full table-auto text-left">
                  <thead className="bg-black/[0.02] text-sm dark:bg-white/[0.02]">
                    <tr>
                      {/* Context Column: Crucial so we know what we are tagging */}
                      <th className="w-2/3 px-4 py-3 text-zinc-500">Original Text</th>
                      <th className="px-4 py-3 capitalize text-zinc-900 dark:text-zinc-100">
                        {category}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                    {submissions.map((s) => {
                      // Safely access the array for the current category
                      const currentTags = s.classification?.[category] || [];
                      
                      return (
                        <tr key={`${category}-${s.id}`} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                          <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {s.text}
                          </td>
                          <td className="px-4 py-3">
                            <EditableCell
                              id={s.id}
                              // Dynamically generate the field path (e.g. "classification.frontend")
                              field={`classification.${category}`}
                              value={currentTags.join(", ")}
                              placeholder={`Add ${category} tags...`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
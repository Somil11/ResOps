import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------
// 1. HELPER FUNCTION (Must be inside this file or imported)
// ---------------------------------------------------------
async function getModule(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "modules.json");
    
    // If file doesn't exist, return null
    if (!fs.existsSync(filePath)) return null;
    
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const modules = JSON.parse(fileContent);
    
    // Find the module where the path matches "/modules/slug"
    // Note: ensure your JSON paths match this format
    return modules.find((m: any) => m.path.endsWith(`/${slug}`)) || null;
  } catch (e) {
    console.error("Error reading modules:", e);
    return null;
  }
}

// ---------------------------------------------------------
// 2. PAGE COMPONENT
// ---------------------------------------------------------
// Next.js 15: params is a Promise. We type it as such.
export default async function DynamicModulePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the params before using them
  const { slug } = await params;
  
  // Now fetch the data
  const moduleData = await getModule(slug);

  if (!moduleData) {
    return notFound();
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl dark:bg-indigo-500/10">
           📦
        </div>
        <div>
          <h1 className="text-3xl font-bold capitalize text-zinc-900 dark:text-zinc-50">
            {moduleData.name}
          </h1>
          <p className="text-xs text-zinc-400">
             ID: {moduleData.id}
          </p>
        </div>
      </div>
      
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-zinc-600 dark:text-zinc-400">
          Content for <strong>{moduleData.name}</strong> will appear here.
        </p>
      </div>
    </div>
  );
}
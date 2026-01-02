import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const NODES_FILE = path.join(DATA_DIR, "nodes.json");

function normalizeTag(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 \-]/g, "");
}

export async function POST() {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return NextResponse.json({ error: "No submissions file found" }, { status: 400 });
    }

    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const submissions = JSON.parse(raw || "[]");

    const categories = ["frontend", "backend", "devops", "databases", "tools"];

    const nodesMap: Record<string, { id: number; name: string; category: string; count: number }> = {};

    for (const s of submissions) {
      const classification = s.classification || {};
      for (const cat of categories) {
        const rawVal = classification[cat] || "";
        if (!rawVal) continue;
        // accept comma-separated values or single string
        const parts = String(rawVal).split(",").map((p) => p.trim()).filter(Boolean);
        for (const p of parts) {
          const name = normalizeTag(p);
          if (!name) continue;
          const key = `${cat}::${name}`;
          if (!nodesMap[key]) {
            nodesMap[key] = { id: Date.now() + Math.floor(Math.random() * 1000), name, category: cat, count: 0 };
          }
          nodesMap[key].count += 1;
        }
      }
    }

    const nodes = Object.values(nodesMap).sort((a, b) => b.count - a.count);

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2), "utf-8");

    return NextResponse.json({ nodes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate nodes" }, { status: 500 });
  }
}

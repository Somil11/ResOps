import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data");
const MODULES_FILE = path.join(DATA_DIR, "modules.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET() {
  try {
    ensureDataDir();
    if (!fs.existsSync(MODULES_FILE)) {
      fs.writeFileSync(MODULES_FILE, JSON.stringify([], null, 2));
    }
    const raw = fs.readFileSync(MODULES_FILE, "utf-8");
    const modules = JSON.parse(raw || "[]");
    return NextResponse.json({ modules });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to read modules" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    ensureDataDir();
    let modules: any[] = [];
    if (fs.existsSync(MODULES_FILE)) {
      modules = JSON.parse(fs.readFileSync(MODULES_FILE, "utf-8") || "[]");
    }

    const id = Date.now();
    const moduleObj = { id, name, createdAt: new Date().toISOString() };
    modules.unshift(moduleObj);
    fs.writeFileSync(MODULES_FILE, JSON.stringify(modules, null, 2), "utf-8");

    return NextResponse.json({ module: moduleObj });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
  }
}

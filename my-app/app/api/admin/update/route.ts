import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Item = {
  id: number;
  userId?: string;
  text: string;
  forAI: string;
  classification?: Record<string, string[]>;
  createdAt: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, field, value } = body as { id: number; field: string; value: string };
    if (!id || !field) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

    const dataDir = path.join(process.cwd(), "data");
    const file = path.join(dataDir, "submissions.json");
    let items: Item[] = [];
    try {
      const content = await fs.readFile(file, "utf8");
      items = JSON.parse(content) as Item[];
    } catch (e) {
      return NextResponse.json({ ok: false, error: "no data" }, { status: 404 });
    }

    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    // support field: 'text' or 'classification.frontend' etc.
    if (field === "text") {
      items[idx].text = String(value ?? "");
      items[idx].forAI = String(value ?? "").toLowerCase().replace(/\s+/g, " ");
    } else if (field.startsWith("classification.")) {
      const key = field.split(".")[1];
      if (!items[idx].classification) items[idx].classification = {};
      // value is comma separated list
      const arr = String(value ?? "").split(/,\s*/).filter(Boolean);
      items[idx].classification[key] = arr;
    } else {
      // unknown field
      return NextResponse.json({ ok: false, error: "unsupported field" }, { status: 400 });
    }

    await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, item: items[idx] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}

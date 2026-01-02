import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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

async function classifyWithGemini(input: string) {
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!key) return null;

  const prompt = `You are given a user-submitted text. Extract and categorize technologies, frameworks and tools mentioned into JSON with keys: frontend, backend, devops, databases, tools. Return only valid JSON.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${encodeURIComponent(
      key
    )}`;
    const body = {
      prompt: { text: `${prompt}\n\nUser text:\n${input}` },
      temperature: 0.0,
      maxOutputTokens: 800,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const textResp = data?.candidates?.[0]?.content ?? data?.output?.[0]?.content;
    if (!textResp) return null;
    const jsonMatch = String(textResp).trim();
    try {
      return JSON.parse(jsonMatch);
    } catch (e) {
      const m = jsonMatch.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      return null;
    }
  } catch (e) {
    console.error("Gemini classify error:", e);
    return null;
  }
}

function heuristicClassify(input: string) {
  const s = input.toLowerCase();
  const contains = (w: string) => s.includes(w);
  const frontend: string[] = [];
  const backend: string[] = [];
  const devops: string[] = [];
  const databases: string[] = [];
  const tools: string[] = [];

  if (contains("react")) frontend.push("React");
  if (contains("next.js") || contains("next ")) frontend.push("Next.js");
  if (contains("vue")) frontend.push("Vue");
  if (contains("angular")) frontend.push("Angular");

  if (contains("node") || contains("node.js")) backend.push("Node.js");
  if (contains("express")) backend.push("Express");
  if (contains("django")) backend.push("Django");
  if (contains("flask")) backend.push("Flask");

  if (contains("docker")) devops.push("Docker");
  if (contains("kubernetes") || contains("k8s")) devops.push("Kubernetes");
  if (contains("terraform")) devops.push("Terraform");
  if (contains("aws")) devops.push("AWS");
  if (contains("gcp")) devops.push("GCP");

  if (contains("postgres") || contains("postgresql")) databases.push("Postgres");
  if (contains("mysql")) databases.push("MySQL");
  if (contains("mongodb")) databases.push("MongoDB");

  if (contains("prisma")) tools.push("Prisma");
  if (contains("github actions") || contains("github-actions")) tools.push("GitHub Actions");
  if (contains("jest")) tools.push("Jest");
  if (contains("cypress")) tools.push("Cypress");

  return { frontend, backend, devops, databases, tools };
}

export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const file = path.join(dataDir, "submissions.json");

    let items: Item[] = [];
    try {
      const content = await fs.readFile(file, "utf8");
      items = JSON.parse(content) as Item[];
    } catch (e) {
      return NextResponse.json({ ok: false, error: "No submissions found" }, { status: 404 });
    }

    let updated = 0;
    for (const item of items) {
      const ai = (await classifyWithGemini(item.text)) ?? heuristicClassify(item.text);
      if (ai) {
        item.classification = {
          frontend: Array.isArray(ai.frontend) ? ai.frontend.map(String) : [],
          backend: Array.isArray(ai.backend) ? ai.backend.map(String) : [],
          devops: Array.isArray(ai.devops) ? ai.devops.map(String) : [],
          databases: Array.isArray(ai.databases) ? ai.databases.map(String) : [],
          tools: Array.isArray(ai.tools) ? ai.tools.map(String) : [],
        };
        updated++;
      }
    }

    await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, updated, total: items.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

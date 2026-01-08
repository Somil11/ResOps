import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
// use global fetch provided by the runtime

type Item = {
  id: number;
  userId?: string;
  text: string;
  forAI: string;
  classification?: {
    frontend: string[];
    backend: string[];
    devops: string[];
    databases: string[];
    tools: string[];
  };
  createdAt: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = String(body.text ?? "").trim();

    const forAI = text.toLowerCase().replace(/\s+/g, " ");

    const dataDir = path.join(process.cwd(), "data");
    const file = path.join(dataDir, "submissions.json");

    await fs.mkdir(dataDir, { recursive: true });

    let items: Item[] = [];
    try {
      const content = await fs.readFile(file, "utf8");
      items = JSON.parse(content) as Item[];
    } catch (e) {
      // file might not exist yet
    }

    const item: Item = {
      id: Date.now(),
      userId: String(body.userId ?? "").trim() || undefined,
      text,
      forAI,
      createdAt: new Date().toISOString(),
    };

    // Try to classify with Gemini (Google Generative) if API key present, otherwise use heuristic
    async function classifyWithGemini(input: string) {
      const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
      if (!key) return null;

      const prompt = `You are given a user-submitted text. Extract and categorize technologies, frameworks and tools mentioned into JSON with keys: frontend, backend, devops, databases, tools. Return only valid JSON. Example: {"frontend": ["React"], "backend": ["Node.js"], "devops": ["Docker"], "databases": ["Postgres"], "tools": ["GitHub Actions"]}`;

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

      // frontend
      if (contains("react")) frontend.push("React");
      if (contains("next.js") || contains("next ")) frontend.push("Next.js");
      if (contains("vue")) frontend.push("Vue");
      if (contains("angular")) frontend.push("Angular");

      // backend
      if (contains("node") || contains("node.js")) backend.push("Node.js");
      if (contains("express")) backend.push("Express");
      if (contains("django")) backend.push("Django");
      if (contains("flask")) backend.push("Flask");

      // devops
      if (contains("docker")) devops.push("Docker");
      if (contains("kubernetes") || contains("k8s")) devops.push("Kubernetes");
      if (contains("terraform")) devops.push("Terraform");
      if (contains("aws")) devops.push("AWS");
      if (contains("gcp")) devops.push("GCP");

      // databases
      if (contains("postgres") || contains("postgresql")) databases.push("Postgres");
      if (contains("mysql")) databases.push("MySQL");
      if (contains("mongodb")) databases.push("MongoDB");

      // tools
      if (contains("prisma")) tools.push("Prisma");
      if (contains("github actions") || contains("github-actions")) tools.push("GitHub Actions");
      if (contains("jest")) tools.push("Jest");
      if (contains("cypress")) tools.push("Cypress");

      return { frontend, backend, devops, databases, tools };
    }

    const aiResult = (await classifyWithGemini(text)) ?? heuristicClassify(text);
    if (aiResult) {
      item.classification = {
        frontend: Array.isArray(aiResult.frontend) ? aiResult.frontend.map(String) : [],
        backend: Array.isArray(aiResult.backend) ? aiResult.backend.map(String) : [],
        devops: Array.isArray(aiResult.devops) ? aiResult.devops.map(String) : [],
        databases: Array.isArray(aiResult.databases) ? aiResult.databases.map(String) : [],
        tools: Array.isArray(aiResult.tools) ? aiResult.tools.map(String) : [],
      };
    }

    // REMOVED: Check for existing userId. 
    // NOW: Always append the new item.
    items.push(item);
    
    await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
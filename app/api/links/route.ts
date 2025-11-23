import { db } from "@/lib/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(links);
  return Response.json(all, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  let { url, code } = body;

  if (!url) return Response.json({ error: "URL required" }, { status: 400 });

  // Normalize URL (important)
  try {
    const parsed = new URL(url.trim());

    // Force same formatting for duplicates
    parsed.hash = "";
    url = parsed.toString().replace(/\/$/, ""); 
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check duplicate URL
  const urlExists = await db.select().from(links).where(eq(links.url, url));
  if (urlExists.length > 0) {
    return Response.json({ error: "URL already exists" }, { status: 409 });
  }

  // Auto-generate code
  if (!code) {
    code = Math.random().toString(36).substring(2, 8);
  }

  // Check duplicate code
  const codeExists = await db.select().from(links).where(eq(links.code, code));
  if (codeExists.length > 0) {
    return Response.json({ error: "Code exists" }, { status: 409 });
  }

  await db.insert(links).values({
    code,
    url,
  });

  return Response.json({ code, url }, { status: 201 });
}

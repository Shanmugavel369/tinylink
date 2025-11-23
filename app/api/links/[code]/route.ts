import { db } from "@/lib/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;

  const data = await db
    .select()
    .from(links)
    .where(eq(links.code, code));

  if (!data.length) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(data[0], { status: 200 });
}

export async function DELETE(req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;

  await db.delete(links).where(eq(links.code, code));

  return Response.json({ ok: true });
}

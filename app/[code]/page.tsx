import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function RedirectPage({ params }: any) {
  const { code } = await params;

  const result = await db.select().from(links).where(eq(links.code, code));

  if (!result.length) {
    return <h1>404 Not Found</h1>;
  }

  const link = result[0];

  // update click count
  await db
    .update(links)
    .set({
      clicks: (link.clicks ?? 0) + 1,
      lastClicked: new Date(),
    })
    .where(eq(links.code, code));

  redirect(link.url);
}

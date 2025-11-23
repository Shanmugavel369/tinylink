import { db } from "@/lib/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";
import CopyButton from "./CopyButton";

export default async function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const data = await db
    .select()
    .from(links)
    .where(eq(links.code, code));

  if (!data.length) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">404 - Link not found</h1>
      </div>
    );
  }

  const link = data[0];
  const shortUrl = `${process.env.BASE_URL}/${link.code}`;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Link Stats</h1>

      <div className="p-4 border rounded-lg bg-white shadow space-y-2">
        <p>
          <span className="font-semibold">Short Code:</span> {link.code}
        </p>

        <p className="truncate">
          <span className="font-semibold">Original URL:</span> {link.url}
        </p>

        <p>
          <span className="font-semibold">Total Clicks:</span> {link.clicks}
        </p>

        <p>
          <span className="font-semibold">Last Clicked:</span>{" "}
          {link.lastClicked
            ? new Date(link.lastClicked).toLocaleString()
            : "-"}
        </p>

        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {link.createdAt
            ? new Date(link.createdAt).toLocaleString()
            : "-"}
        </p>

        <CopyButton shortUrl={shortUrl} />
      </div>
    </div>
  );
}

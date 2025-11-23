"use client";

export default function CopyButton({ shortUrl }: { shortUrl: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(shortUrl)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Copy Short Link
    </button>
  );
}

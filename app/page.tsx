"use client";

import { useEffect, useState } from "react";
import {
  FiCopy,
  FiTrash2,
  FiExternalLink,
  FiLink,
  FiClock,
  FiActivity,
  FiFolderPlus,
  FiLoader
} from "react-icons/fi";


export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [links, setLinks] = useState([]);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  async function fetchLinks() {
    setFetching(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setFetching(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function createLink(e: any) {
    e.preventDefault();
    setLoading(true);

    const body: any = { url };
    if (code.trim() !== "") body.code = code;

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setUrl("");
      setCode("");
      fetchLinks();
      showToast("Short link created 🎉");
    } else {
      const err = await res.json();
      showToast(err.error);
    }

    setLoading(false);
  }

  async function deleteLink(code: string) {
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    fetchLinks();
    showToast("Deleted successfully");
  }

  async function copyToClipboard(code: string) {
    const url = `${window.location.origin}/${code}`;
    await navigator.clipboard.writeText(url);
    showToast("Copied to clipboard 📋");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
          {toast}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        TinyLink Dashboard
      </h1>

      {/* Add Link Form */}
      <form
        onSubmit={createLink}
        className="p-4 sm:p-5 border rounded-xl space-y-4 bg-white shadow-md"
      >
        <div>
          <label className="font-semibold">Long URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://example.com/very-long-url"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Custom Code (optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="mydocs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </form>

      {/* Card List View */}
      {fetching ? (
        <div className="flex justify-center mt-6 text-gray-500">
          <FiLoader className="animate-spin text-2xl" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center mt-12 text-gray-600">
          <FiFolderPlus className="mx-auto text-5xl mb-3 text-gray-400" />
          <p className="font-semibold text-lg">No links created yet</p>
          <p className="text-sm">Start by adding your first link above</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {links.map((link: any, index: number) => (
            <div
              key={link.code}
              className="p-5 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <FiLink className="text-blue-600 text-xl" />
                  <p className="text-lg font-semibold">{link.code}</p>
                </div>

                <div className="flex gap-4 text-xl">
                  <button
                    onClick={() => copyToClipboard(link.code)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiCopy />
                  </button>

                  <button
                    onClick={() => deleteLink(link.code)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 text-gray-700 text-sm break-all">
                <FiExternalLink className="text-gray-500" />
                <a
                  href={link.url}
                  target="_blank"
                  className="text-blue-600 underline break-all"
                >
                  {link.url}
                </a>
              </div>

              {/* Stats Row */}
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-blue-600" />
                  <span className="font-semibold">Clicks:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                    {link.clicks}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-500" />
                  <span className="font-semibold">Last Clicked:</span>
                  {link.lastClicked
                    ? new Date(link.lastClicked).toLocaleString()
                    : "Never"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

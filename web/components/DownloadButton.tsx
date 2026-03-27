"use client";

import { useState } from "react";
import JSZip from "jszip";
import type { DocFile } from "@/lib/types";

interface DownloadButtonProps {
  slug: string;
  skillContent: string;
  docs: DocFile[];
}

export default function DownloadButton({
  slug,
  skillContent,
  docs,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(slug)!;

      // Add SKILL.md
      folder.file("SKILL.md", skillContent);

      // Add docs
      if (docs.length > 0) {
        const docsFolder = folder.folder("docs")!;
        for (const doc of docs) {
          docsFolder.file(doc.filename, doc.content);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors cursor-pointer"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {downloading ? "Generating..." : "Download ZIP"}
    </button>
  );
}

"use client";

import { useState } from "react";
import type { DocFile } from "@/lib/types";

export default function DocSection({ docs }: { docs: DocFile[] }) {
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  if (docs.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-lg font-semibold text-zinc-100 mb-1">
        Reference Docs
      </h2>
      <p className="text-sm text-zinc-500 mb-4">
        {docs.length} supporting document{docs.length !== 1 ? "s" : ""} included
        with this skill
      </p>

      <div className="space-y-2">
        {docs.map((doc) => {
          const isOpen = openDoc === doc.filename;
          return (
            <div
              key={doc.filename}
              className="border border-zinc-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenDoc(isOpen ? null : doc.filename)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-zinc-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-zinc-200">
                      {doc.title}
                    </span>
                    <span className="block text-xs text-zinc-600 font-mono">
                      {doc.filename}
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-zinc-800">
                  <pre className="mt-3 text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                    {doc.content}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

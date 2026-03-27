"use client";

import { useState, useEffect } from "react";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import type { DocFile } from "@/lib/types";
import { GITHUB_RAW_BASE } from "@/lib/constants";

type OS = "mac" | "windows";
type Tool = "claude" | "cursor";

const TOOL_DIRS: Record<Tool, string> = {
  claude: ".claude/skills",
  cursor: ".cursor/rules",
};

function buildCommands(
  slug: string,
  tool: Tool,
  docs: DocFile[],
  os: OS
): string {
  const dir = `${TOOL_DIRS[tool]}/${slug}`;
  const base = `${GITHUB_RAW_BASE}/${slug}`;

  if (os === "windows") {
    // PowerShell commands
    const lines = [
      `# Run from your project root in PowerShell`,
      `New-Item -ItemType Directory -Force -Path "${dir}" | Out-Null`,
      `Invoke-WebRequest -Uri "${base}/SKILL.md" -OutFile "${dir}/SKILL.md"`,
    ];
    if (docs.length > 0) {
      lines.push(`New-Item -ItemType Directory -Force -Path "${dir}/docs" | Out-Null`);
      for (const doc of docs) {
        lines.push(
          `Invoke-WebRequest -Uri "${base}/docs/${doc.filename}" -OutFile "${dir}/docs/${doc.filename}"`
        );
      }
    }
    return lines.join("\n");
  } else {
    // Bash commands (macOS / Linux / Git Bash)
    const lines = [
      `# Run from your project root`,
      `mkdir -p "${dir}"`,
      `curl -sL "${base}/SKILL.md" -o "${dir}/SKILL.md"`,
    ];
    if (docs.length > 0) {
      lines.push(`mkdir -p "${dir}/docs"`);
      for (const doc of docs) {
        lines.push(
          `curl -sL "${base}/docs/${doc.filename}" -o "${dir}/docs/${doc.filename}"`
        );
      }
    }
    return lines.join(" && \\\n");
  }
}

export default function InstallInstructions({
  slug,
  tools,
  docs,
  skillContent,
}: {
  slug: string;
  tools: string[];
  docs: DocFile[];
  skillContent: string;
}) {
  const [os, setOs] = useState<OS>("mac");

  // Auto-detect OS on mount
  useEffect(() => {
    if (navigator.platform?.toLowerCase().includes("win")) {
      setOs("windows");
    }
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-zinc-100">Install</h2>
        <DownloadButton slug={slug} skillContent={skillContent} docs={docs} />
      </div>

      {/* OS Toggle */}
      <div className="flex items-center gap-1 mb-5 bg-zinc-950 rounded-lg p-1 w-fit border border-zinc-800">
        <button
          onClick={() => setOs("mac")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            os === "mac"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          macOS / Linux
        </button>
        <button
          onClick={() => setOs("windows")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            os === "windows"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Windows
        </button>
      </div>

      {/* Claude install */}
      {tools.includes("claude") && (
        <div className="mb-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Claude Code
          </p>
          <div className="relative bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="absolute top-2 right-2">
              <CopyButton
                text={buildCommands(slug, "claude", docs, os)}
              />
            </div>
            <pre className="px-4 py-3 pr-20 text-sm text-violet-400 font-mono overflow-x-auto whitespace-pre">
              {buildCommands(slug, "claude", docs, os)}
            </pre>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">
            Installs to{" "}
            <code className="text-zinc-500">
              {TOOL_DIRS.claude}/{slug}/
            </code>
            {docs.length > 0 && (
              <span>
                {" "}(includes {docs.length} reference doc
                {docs.length !== 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Cursor install */}
      {tools.includes("cursor") && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Cursor
          </p>
          <div className="relative bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="absolute top-2 right-2">
              <CopyButton
                text={buildCommands(slug, "cursor", docs, os)}
              />
            </div>
            <pre className="px-4 py-3 pr-20 text-sm text-blue-400 font-mono overflow-x-auto whitespace-pre">
              {buildCommands(slug, "cursor", docs, os)}
            </pre>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">
            Installs to{" "}
            <code className="text-zinc-500">
              {TOOL_DIRS.cursor}/{slug}/
            </code>
            {docs.length > 0 && (
              <span>
                {" "}(includes {docs.length} reference doc
                {docs.length !== 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

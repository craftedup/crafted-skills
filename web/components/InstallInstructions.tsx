"use client";

import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import type { DocFile } from "@/lib/types";
import { NPX_CMD } from "@/lib/constants";

const TOOL_DIRS: Record<string, string> = {
  claude: ".claude/skills",
  cursor: ".cursor/skills",
};

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
  const claudeCmd = `${NPX_CMD} install ${slug}`;
  const cursorCmd = `${NPX_CMD} install ${slug} --tool cursor`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-zinc-100">Install</h2>
        <DownloadButton slug={slug} skillContent={skillContent} docs={docs} />
      </div>

      {/* Claude install */}
      {tools.includes("claude") && (
        <div className="mb-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Claude Code
          </p>
          <div className="flex items-center gap-3 bg-zinc-950 rounded-lg px-4 py-3 border border-zinc-800">
            <code className="flex-1 text-sm text-violet-400 font-mono overflow-x-auto">
              {claudeCmd}
            </code>
            <CopyButton text={claudeCmd} />
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
          <div className="flex items-center gap-3 bg-zinc-950 rounded-lg px-4 py-3 border border-zinc-800">
            <code className="flex-1 text-sm text-blue-400 font-mono overflow-x-auto">
              {cursorCmd}
            </code>
            <CopyButton text={cursorCmd} />
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

      {/* How it works note */}
      <div className="mt-5 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">
          Run from your project root. Requires{" "}
          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 underline hover:text-zinc-400"
          >
            Node.js 18+
          </a>
          . Downloads the skill directly from GitHub &mdash; no npm account needed.
        </p>
      </div>
    </div>
  );
}

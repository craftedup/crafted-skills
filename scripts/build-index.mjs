/**
 * Reads all skill folders and generates skills/index.json
 *
 * Structure: skills/<slug>/SKILL.md + optional skills/<slug>/docs/*.md
 * The index includes doc filenames so the CLI can download entire skill folders
 * without needing the GitHub API.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsDir = path.resolve(__dirname, "..", "skills");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    if (val.startsWith("[") || val === "") continue;
    fm[key] = val;
  }
  // Parse array fields (tags, tools)
  const arrayFields = ["tags", "tools"];
  for (const field of arrayFields) {
    const regex = new RegExp(`^${field}:\\s*\\n((?:\\s+-\\s+.*\\n?)+)`, "m");
    const arrayMatch = content.match(regex);
    if (arrayMatch) {
      fm[field] = arrayMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\s+-\s+/, "").trim())
        .filter(Boolean);
    }
  }
  return fm;
}

// Read skill directories (skip files like index.json)
const dirs = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const index = dirs.map((slug) => {
  const skillFile = path.join(skillsDir, slug, "SKILL.md");
  const content = fs.readFileSync(skillFile, "utf8");
  const data = parseFrontmatter(content);

  // Check for docs
  const docsDir = path.join(skillsDir, slug, "docs");
  let docs = [];
  if (fs.existsSync(docsDir)) {
    docs = fs
      .readdirSync(docsDir)
      .filter((f) => f.endsWith(".md"))
      .sort();
  }

  return {
    name: data.name || slug,
    slug: data.slug || slug,
    description: data.description || "",
    author: data.author || "",
    category: data.category || "",
    tags: data.tags || [],
    tools: data.tools || [],
    version: data.version || "1.0.0",
    docs,
  };
});

const outPath = path.join(skillsDir, "index.json");
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(
  `Generated ${outPath} with ${index.length} skills (${index.reduce((n, s) => n + s.docs.length, 0)} total docs)`
);

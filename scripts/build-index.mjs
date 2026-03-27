/**
 * Reads all skill folders and generates skills/index.json
 *
 * Structure: skills/<slug>/SKILL.md + meta.json + optional docs/*.md
 * The index includes doc filenames so the CLI can download entire skill folders
 * without needing the GitHub API.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsDir = path.resolve(__dirname, "..", "skills");

// Read skill directories (skip files like index.json)
const dirs = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const index = dirs.map((slug) => {
  const metaPath = path.join(skillsDir, slug, "meta.json");
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

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
    name: meta.name || slug,
    slug: meta.slug || slug,
    description: meta.description || "",
    author: meta.author || "",
    category: meta.category || "",
    tags: meta.tags || [],
    tools: meta.tools || [],
    version: meta.version || "1.0.0",
    docs,
  };
});

const outPath = path.join(skillsDir, "index.json");
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(
  `Generated ${outPath} with ${index.length} skills (${index.reduce((n, s) => n + s.docs.length, 0)} total docs)`
);

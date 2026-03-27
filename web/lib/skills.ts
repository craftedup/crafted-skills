import fs from "fs";
import path from "path";
import type { Skill, SkillMeta, DocFile } from "./types";

const skillsDirectory = path.resolve(process.cwd(), "..", "skills");

/**
 * Each skill is a folder: skills/<slug>/SKILL.md + meta.json
 * Optionally with: skills/<slug>/docs/*.md
 */
function getSkillDirs(): string[] {
  return fs
    .readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
}

function readMeta(slug: string): Record<string, unknown> {
  const metaPath = path.join(skillsDirectory, slug, "meta.json");
  const raw = fs.readFileSync(metaPath, "utf8");
  return JSON.parse(raw);
}

function readDocs(skillDir: string): DocFile[] {
  const docsPath = path.join(skillsDirectory, skillDir, "docs");
  if (!fs.existsSync(docsPath)) return [];

  return fs
    .readdirSync(docsPath)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const content = fs.readFileSync(path.join(docsPath, filename), "utf8");
      // Extract title from first # heading, or derive from filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title =
        titleMatch?.[1] ||
        filename
          .replace(/\.reference\.md$/, "")
          .replace(/\.md$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

      return { filename, title, content };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

export async function getAllSkills(): Promise<SkillMeta[]> {
  const dirs = getSkillDirs();

  const skills: SkillMeta[] = dirs.map((slug) => {
    const data = readMeta(slug);
    const docs = readDocs(slug);

    return {
      name: data.name as string,
      slug: (data.slug as string) || slug,
      description: data.description as string,
      howToUse: (data.howToUse as string) || "",
      author: data.author as string,
      category: data.category as string,
      tags: (data.tags as string[]) || [],
      tools: (data.tools as ("claude" | "cursor")[]) || [],
      version: (data.version as string) || "1.0.0",
      createdAt: (data.createdAt as string) || "",
      hasDocs: docs.length > 0,
      docCount: docs.length,
    };
  });

  return skills.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getSkillBySlug(slug: string): Promise<Skill> {
  const data = readMeta(slug);
  const skillFile = path.join(skillsDirectory, slug, "SKILL.md");
  const content = fs.readFileSync(skillFile, "utf8");
  const docs = readDocs(slug);

  return {
    name: data.name as string,
    slug: (data.slug as string) || slug,
    description: data.description as string,
    howToUse: (data.howToUse as string) || "",
    author: data.author as string,
    category: data.category as string,
    tags: (data.tags as string[]) || [],
    tools: (data.tools as ("claude" | "cursor")[]) || [],
    version: (data.version as string) || "1.0.0",
    createdAt: (data.createdAt as string) || "",
    content,
    hasDocs: docs.length > 0,
    docCount: docs.length,
    docs,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const skills = await getAllSkills();
  return [...new Set(skills.map((s) => s.category))].sort();
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Skill, SkillMeta, DocFile } from "./types";

const skillsDirectory = path.resolve(process.cwd(), "..", "skills");

/**
 * Each skill is a folder: skills/<slug>/SKILL.md
 * Optionally with: skills/<slug>/docs/*.md
 */
function getSkillDirs(): string[] {
  return fs
    .readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
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
    const skillFile = path.join(skillsDirectory, slug, "SKILL.md");
    const fileContents = fs.readFileSync(skillFile, "utf8");
    const { data } = matter(fileContents);
    const docs = readDocs(slug);

    return {
      name: data.name,
      slug: data.slug || slug,
      description: data.description,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      tools: data.tools || [],
      version: data.version || "1.0.0",
      createdAt: data.createdAt || "",
      hasDocs: docs.length > 0,
      docCount: docs.length,
    };
  });

  return skills.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getSkillBySlug(slug: string): Promise<Skill> {
  const skillFile = path.join(skillsDirectory, slug, "SKILL.md");
  const fileContents = fs.readFileSync(skillFile, "utf8");
  const { data, content } = matter(fileContents);
  const docs = readDocs(slug);

  return {
    name: data.name,
    slug: data.slug || slug,
    description: data.description,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    tools: data.tools || [],
    version: data.version || "1.0.0",
    createdAt: data.createdAt || "",
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

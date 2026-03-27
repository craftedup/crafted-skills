#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/craftedup/crafted-skills/main/skills";

const TOOL_DIRS = {
  claude: ".claude/skills",
  cursor: ".cursor/skills",
};

const program = new Command();

program
  .name("crafted-skills")
  .description("Install Claude Code and Cursor AI skills into your project")
  .version("0.1.0");

// ── install ────────────────────────────────────────────────────────
program
  .command("install <skill-name>")
  .description("Install a skill into your project")
  .option("-t, --tool <tool>", "Target tool: claude or cursor", "claude")
  .action(async (skillName, options) => {
    const tool = options.tool;
    if (!TOOL_DIRS[tool]) {
      console.error(`Unknown tool "${tool}". Use "claude" or "cursor".`);
      process.exit(1);
    }

    try {
      // 1. Fetch the SKILL.md
      const skillUrl = `${GITHUB_RAW_BASE}/${skillName}/SKILL.md`;
      console.log(`Fetching ${skillName}...`);

      const res = await fetch(skillUrl);
      if (!res.ok) {
        if (res.status === 404) {
          console.error(
            `\nSkill "${skillName}" not found.\nRun "npx github:craftedup/crafted-skills list" to see available skills.`
          );
        } else {
          console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        process.exit(1);
      }

      const targetDir = path.resolve(process.cwd(), TOOL_DIRS[tool], skillName);
      await fs.mkdir(targetDir, { recursive: true });

      const skillContent = await res.text();
      await fs.writeFile(path.join(targetDir, "SKILL.md"), skillContent, "utf8");

      // 2. Check index.json for docs list
      let docs = [];
      try {
        const indexRes = await fetch(`${GITHUB_RAW_BASE}/index.json`);
        if (indexRes.ok) {
          const index = await indexRes.json();
          const entry = index.find((s) => s.slug === skillName);
          if (entry?.docs?.length) {
            docs = entry.docs;
          }
        }
      } catch {
        // No index or no docs — that's fine
      }

      // 3. Download docs if any
      if (docs.length > 0) {
        const docsDir = path.join(targetDir, "docs");
        await fs.mkdir(docsDir, { recursive: true });

        for (const docFilename of docs) {
          const docUrl = `${GITHUB_RAW_BASE}/${skillName}/docs/${docFilename}`;
          const docRes = await fetch(docUrl);
          if (docRes.ok) {
            const docContent = await docRes.text();
            await fs.writeFile(path.join(docsDir, docFilename), docContent, "utf8");
            console.log(`  + docs/${docFilename}`);
          }
        }
      }

      const relPath = path.relative(process.cwd(), targetDir);
      console.log(`\nInstalled "${skillName}" to ${relPath}/`);
      if (docs.length > 0) {
        console.log(`  Includes ${docs.length} reference doc${docs.length !== 1 ? "s" : ""}`);
      }
      console.log(`\nReady to use with ${tool === "claude" ? "Claude Code" : "Cursor"}.`);
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });

// ── list ───────────────────────────────────────────────────────────
program
  .command("list")
  .description("List all available skills")
  .action(async () => {
    try {
      const res = await fetch(`${GITHUB_RAW_BASE}/index.json`);
      if (!res.ok) {
        console.error("Failed to fetch skill index.");
        process.exit(1);
      }

      const skills = await res.json();

      if (skills.length === 0) {
        console.log("No skills available yet.");
        return;
      }

      const maxName = Math.max(...skills.map((s) => s.name.length), 4);
      const maxCat = Math.max(...skills.map((s) => s.category.length), 8);

      console.log(
        `\n${"NAME".padEnd(maxName + 2)}${"CATEGORY".padEnd(maxCat + 2)}TOOLS`
      );
      console.log("-".repeat(maxName + maxCat + 20));

      for (const skill of skills) {
        const docsNote = skill.docs?.length ? ` (+${skill.docs.length} docs)` : "";
        console.log(
          `${skill.name.padEnd(maxName + 2)}${skill.category.padEnd(maxCat + 2)}${skill.tools.join(", ")}${docsNote}`
        );
      }

      console.log(`\n${skills.length} skill(s) available`);
      console.log(`Install with: npx github:craftedup/crafted-skills install <slug>\n`);
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });

// ── search ─────────────────────────────────────────────────────────
program
  .command("search <query>")
  .description("Search for skills by name, category, or tag")
  .action(async (query) => {
    try {
      const res = await fetch(`${GITHUB_RAW_BASE}/index.json`);
      if (!res.ok) {
        console.error("Failed to fetch skill index.");
        process.exit(1);
      }

      const skills = await res.json();
      const q = query.toLowerCase();
      const matches = skills.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );

      if (matches.length === 0) {
        console.log(`No skills matching "${query}".`);
        return;
      }

      for (const skill of matches) {
        console.log(`\n  ${skill.name} (${skill.slug})`);
        console.log(`  ${skill.description}`);
        console.log(`  Category: ${skill.category}  |  Tools: ${skill.tools.join(", ")}`);
      }
      console.log(`\n${matches.length} result(s)\n`);
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });

program.parse();

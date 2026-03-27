# Crafted Skills

An internal skill repository for Claude Code and Cursor AI. Browse, search, and install skills with one command.

**Live site:** https://craftedup.github.io/crafted-skills

## Install a skill

From your project root:

```bash
npx github:craftedup/crafted-skills install <skill-name>
```

This downloads the skill folder (SKILL.md + any reference docs) into `.claude/skills/<skill-name>/`.

For Cursor instead:

```bash
npx github:craftedup/crafted-skills install <skill-name> --tool cursor
```

Installs to `.cursor/skills/<skill-name>/`.

### Other CLI commands

```bash
# List all available skills
npx github:craftedup/crafted-skills list

# Search skills
npx github:craftedup/crafted-skills search "wordpress"
```

## Contributing a skill

### Skill folder structure

Each skill lives in its own folder under `skills/`:

```
skills/
└── my-skill-name/
    ├── meta.json          # Metadata (displayed on the website)
    ├── SKILL.md           # The actual skill instructions (what the AI reads)
    └── docs/              # Optional reference docs
        ├── some-guide.reference.md
        └── another-guide.reference.md
```

### 1. Create the folder

```bash
mkdir skills/my-skill-name
```

Use a slug-friendly name — lowercase, hyphens, no spaces.

### 2. Write `meta.json`

This is what the website displays. It is **not** read by Claude or Cursor — keep it separate from the skill content.

```json
{
  "name": "My Skill Name",
  "slug": "my-skill-name",
  "description": "A short description of what this skill does.",
  "howToUse": "Explain how a developer should actually use this skill. What do they tell Claude/Cursor? What inputs does it need? Example: 'Tell Claude to use this skill and provide the API spec. It will generate typed client code with error handling.'",
  "author": "Your Name",
  "category": "architecture",
  "tags": ["relevant", "tags", "here"],
  "tools": ["claude", "cursor"],
  "version": "1.0.0",
  "createdAt": "2026-03-27"
}
```

**Fields:**

| Field | Description |
|-------|-------------|
| `name` | Display name on the website |
| `slug` | Must match the folder name |
| `description` | One-liner shown on the skill card |
| `howToUse` | Practical instructions — what to tell the AI, what inputs to provide |
| `author` | Who wrote it |
| `category` | Grouping for filters (e.g. `architecture`, `code-quality`, `testing`, `git`, `devops`) |
| `tags` | Array of searchable tags |
| `tools` | Which tools support it: `["claude"]`, `["cursor"]`, or `["claude", "cursor"]` |
| `version` | Semver string |
| `createdAt` | Date string (YYYY-MM-DD) |

### 3. Write `SKILL.md`

This is the file Claude/Cursor actually reads. Write it as direct instructions to the AI — no frontmatter, no metadata, just the skill content.

```markdown
# My Skill Name

When the user asks you to [do the thing], follow this process:

1. First, do X
2. Then do Y
3. Finally, do Z

## Rules

- Always do A
- Never do B
```

### 4. Add reference docs (optional)

If the skill needs supporting documentation (API references, coding standards, file structure guides), add them to a `docs/` subfolder:

```
skills/my-skill-name/docs/
├── api-reference.reference.md
└── coding-standards.reference.md
```

These get installed alongside SKILL.md so the AI has context to work with.

### 5. Push to `main`

The site rebuilds automatically via GitHub Actions. Your skill will appear on the website within a couple minutes.

## Local development

```bash
# Install dependencies
npm install

# Run the site locally
npm run dev
```

The site will be at `http://localhost:3000/crafted-skills/`.

## Project structure

```
crafted-skills/
├── skills/                  # All skills live here
│   └── <skill-name>/
│       ├── meta.json
│       ├── SKILL.md
│       └── docs/            # Optional
├── web/                     # Next.js website
│   ├── app/                 # Pages (homepage + skill detail)
│   ├── components/          # React components
│   └── lib/                 # Skill loading, types, constants
├── bin/                     # CLI tool (npx install command)
├── scripts/                 # Build scripts (index generation)
└── .github/workflows/       # Auto-deploy to GitHub Pages
```

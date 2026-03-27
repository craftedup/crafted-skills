export interface DocFile {
  filename: string;
  title: string;
  content: string;
}

export interface SkillMeta {
  name: string;
  slug: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  tools: ("claude" | "cursor")[];
  version: string;
  createdAt: string;
  hasDocs: boolean;
  docCount: number;
}

export interface Skill extends SkillMeta {
  content: string;
  docs: DocFile[];
}

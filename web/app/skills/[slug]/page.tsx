import type { Metadata } from "next";
import Link from "next/link";
import { getAllSkills, getSkillBySlug } from "@/lib/skills";
import Badge from "@/components/Badge";
import InstallInstructions from "@/components/InstallInstructions";
import SkillContent from "@/components/SkillContent";
import DocSection from "@/components/DocSection";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  return {
    title: skill.name,
    description: skill.description,
  };
}

const toolColors: Record<string, "violet" | "blue"> = {
  claude: "violet",
  cursor: "blue",
};

export default async function SkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to skills
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-50 mb-3">{skill.name}</h1>
        <p className="text-lg text-zinc-400 mb-4">{skill.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{skill.category}</Badge>
          {skill.tools.map((tool) => (
            <Badge key={tool} variant={toolColors[tool] || "default"}>
              {tool}
            </Badge>
          ))}
          {skill.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
          <span className="text-xs text-zinc-600 ml-2">
            v{skill.version} &middot; by {skill.author}
          </span>
        </div>
      </div>

      {/* Install */}
      <div className="mb-10">
        <InstallInstructions
          slug={skill.slug}
          tools={skill.tools}
          docs={skill.docs}
          skillContent={skill.content}
        />
      </div>

      {/* Included Docs */}
      {skill.docs.length > 0 && (
        <div className="mb-10">
          <DocSection docs={skill.docs} />
        </div>
      )}

      {/* Content */}
      <SkillContent content={skill.content} />
    </div>
  );
}

import Link from "next/link";
import Badge from "./Badge";
import type { SkillMeta } from "@/lib/types";

const toolColors: Record<string, "violet" | "blue"> = {
  claude: "violet",
  cursor: "blue",
};

export default function SkillCard({ skill }: { skill: SkillMeta }) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-violet-500/50 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors">
          {skill.name}
        </h3>
        <Badge variant="default">{skill.category}</Badge>
      </div>

      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex items-center gap-2">
        {skill.tools.map((tool) => (
          <Badge key={tool} variant={toolColors[tool] || "default"}>
            {tool}
          </Badge>
        ))}
        {skill.hasDocs && (
          <Badge variant="green">
            {skill.docCount} doc{skill.docCount !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    </Link>
  );
}

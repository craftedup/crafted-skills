import { getAllSkills, getAllCategories } from "@/lib/skills";
import { SITE_DESCRIPTION, NPX_CMD } from "@/lib/constants";
import SkillGrid from "@/components/SkillGrid";

export default async function HomePage() {
  const [skills, categories] = await Promise.all([
    getAllSkills(),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
          AI Skills,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            Ready to Use
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">{SITE_DESCRIPTION}</p>
        <div className="mt-6 flex items-center gap-3">
          <code className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-violet-400 font-mono">
            {NPX_CMD} install &lt;skill-name&gt;
          </code>
        </div>
      </section>

      {/* Skill Grid */}
      <SkillGrid skills={skills} categories={categories} />
    </div>
  );
}

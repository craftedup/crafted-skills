import { getAllSkills, getAllCategories } from "@/lib/skills";
import { SITE_DESCRIPTION } from "@/lib/constants";
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
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download ZIP
          </span>
          <span className="text-zinc-700">or</span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Copy &amp; paste a terminal command
          </span>
        </div>
      </section>

      {/* Skill Grid */}
      <SkillGrid skills={skills} categories={categories} />
    </div>
  );
}

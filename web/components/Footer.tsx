import { SITE_NAME, GITHUB_REPO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          {SITE_NAME} &mdash; Open-source AI skill marketplace
        </p>
        <div className="flex items-center gap-6">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Contribute a Skill
          </a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { SITE_NAME, GITHUB_REPO } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            CS
          </div>
          <span className="text-lg font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Browse
          </Link>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

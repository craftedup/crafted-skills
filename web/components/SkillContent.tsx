import { MDXRemote } from "next-mdx-remote/rsc";

export default function SkillContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-code:text-violet-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-400 prose-strong:text-zinc-200">
      <MDXRemote source={content} />
    </div>
  );
}

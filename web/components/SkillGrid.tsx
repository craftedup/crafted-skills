"use client";

import { useState, useMemo } from "react";
import SkillCard from "./SkillCard";
import type { SkillMeta } from "@/lib/types";

export default function SkillGrid({
  skills,
  categories,
}: {
  skills: SkillMeta[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTool, setSelectedTool] = useState<string>("all");

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        !search ||
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.description.toLowerCase().includes(search.toLowerCase()) ||
        skill.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || skill.category === selectedCategory;

      const matchesTool =
        selectedTool === "all" || skill.tools.includes(selectedTool as "claude" | "cursor");

      return matchesSearch && matchesCategory && matchesTool;
    });
  }, [skills, search, selectedCategory, selectedTool]);

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="all">All Tools</option>
          <option value="claude">Claude</option>
          <option value="cursor">Cursor</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-500 mb-4">
        {filtered.length} skill{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500">No skills match your search.</p>
        </div>
      )}
    </div>
  );
}

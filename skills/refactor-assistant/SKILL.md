---
name: Refactor Assistant
slug: refactor-assistant
description: Identifies code smells and suggests targeted refactoring strategies while preserving existing behavior.
author: crafted-skills
category: code-quality
tags:
  - refactoring
  - clean-code
  - maintainability
tools:
  - claude
  - cursor
version: 1.0.0
createdAt: 2026-03-23
---

# Refactor Assistant

When asked to refactor code, follow this structured approach:

## Step 1: Assess
- Read the entire file/module to understand the full context
- Identify existing tests (if any) to ensure behavior is preserved
- Note public API surface that must remain stable

## Step 2: Identify Code Smells
- **Long methods** (>40 lines): Extract into smaller, named functions
- **Deep nesting** (>3 levels): Use early returns, guard clauses
- **Duplicate code**: Extract shared logic into reusable functions
- **God objects**: Split into focused, single-responsibility classes
- **Primitive obsession**: Introduce value objects or enums
- **Feature envy**: Move methods closer to the data they operate on

## Step 3: Apply Refactoring
- Make one refactoring at a time
- Ensure each step preserves existing behavior
- Run tests between each change if possible
- Keep the diff minimal — don't reformat unrelated code

## Rules
- NEVER change behavior while refactoring
- NEVER add new features during a refactoring pass
- If tests don't exist, suggest writing them BEFORE refactoring
- Preserve the existing code style and conventions of the project
- If a refactoring would affect more than 3 files, discuss the plan before proceeding

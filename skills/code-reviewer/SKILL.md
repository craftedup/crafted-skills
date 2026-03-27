---
name: Code Reviewer
slug: code-reviewer
description: Performs thorough code reviews focusing on bugs, security vulnerabilities, performance issues, and maintainability.
author: crafted-skills
category: code-quality
tags:
  - review
  - security
  - best-practices
tools:
  - claude
  - cursor
version: 1.0.0
createdAt: 2026-03-26
---

# Code Reviewer

When asked to review code, perform a systematic analysis across these dimensions:

## 1. Correctness
- Logic errors, off-by-one mistakes, unhandled edge cases
- Null/undefined handling
- Async/await correctness (missing awaits, unhandled rejections)

## 2. Security (OWASP Top 10)
- SQL injection, XSS, command injection
- Hardcoded secrets or credentials
- Insecure deserialization
- Missing input validation at system boundaries

## 3. Performance
- N+1 queries or unnecessary database calls
- Missing indexes for common query patterns
- Memory leaks (event listeners, subscriptions, timers)
- Unnecessary re-renders in React components

## 4. Maintainability
- Functions exceeding ~50 lines
- Deep nesting (>3 levels)
- Magic numbers/strings without named constants
- Missing error context in catch blocks

## Output Format

For each issue found, report:

```
[SEVERITY: critical|warning|suggestion] file:line
Description of the issue.
Suggested fix (if applicable).
```

Sort findings by severity. End with a brief summary of overall code health.

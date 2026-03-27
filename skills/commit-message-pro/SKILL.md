---
name: Commit Message Pro
slug: commit-message-pro
description: Generates conventional commit messages by analyzing staged changes. Detects scope, type, and breaking changes automatically.
author: crafted-skills
category: git
tags:
  - commits
  - conventional-commits
  - git
tools:
  - claude
  - cursor
version: 1.0.0
createdAt: 2026-03-27
---

# Commit Message Pro

When the user asks you to commit changes, follow this process:

1. Run `git diff --cached` to analyze all staged changes
2. Determine the commit type based on the nature of changes:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Formatting, missing semicolons, etc.
   - `refactor`: Code change that neither fixes a bug nor adds a feature
   - `test`: Adding or updating tests
   - `chore`: Build process or auxiliary tool changes

3. Identify the scope from the primary file/module being changed

4. Check for breaking changes (API signature changes, removed exports, renamed public methods)

5. Write a concise subject line (max 72 chars) in imperative mood

6. If the change is complex, add a body explaining **why** the change was made

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer with BREAKING CHANGE notes]
```

## Examples

```
feat(auth): add OAuth2 provider support

Adds Google and GitHub as OAuth2 login providers.
Includes token refresh logic and session persistence.
```

```
fix(api): handle null response from payment gateway

BREAKING CHANGE: PaymentResult type now includes nullable `transactionId`
```

# AGENTS.md

## Context

Solo developer. Stack: Next.js + Node.js. Optimize for speed, clarity, low maintenance.

**Package manager:** npm only. Use `npm` and `npx` commands by default.

## Prime directive

> Ship the smallest correct change. Do not touch anything not asked for.

- Touch as few files as possible
- No formatting-only edits
- No unrelated refactors, renames, or restructures
- No new abstractions for one-time use
- No dead code, no speculative TODOs

---

## Before writing any code

1. Read at least one relevant existing file in the same area to understand local conventions
2. Check if a similar pattern already exists in the repo before inventing one
3. State any assumption made briefly — do not ask for confirmation on straightforward tasks

---

## File safety

- Read only files directly relevant to the task
- Only modify files that are directly necessary to complete the task
- Do not delete, truncate, or fully replace an existing file unless strictly necessary
- For destructive or hard-to-rollback changes: state the risk explicitly or ask for confirmation
- Do not rename or move files unless asked

## Environment & secrets

- Never hardcode secrets, API keys, or credentials
- When adding a new env variable: document it in `.env.example` with a placeholder value
- Do not log or expose env values in responses or production console output
- Do not modify `.env` or deployment config unless the task explicitly requires it

## UI consistency

- Match existing font, spacing, color, and border-radius — do not introduce new visual style
- Do not add animations, shadows, or gradients unless already present in the design system
- Before creating a new component, reference the nearest existing component in the repo as a pattern
- Preserve responsive behavior when editing UI

## State management

- Priority order: server state → local `useState` → context → global store
- Do not add a state library (Zustand, Redux, Jotai…) unless one is already in the repo
- Do not use global state for data needed in only 1–2 components
- Avoid `useEffect` for data fetching — prefer server components or the existing fetching library in the repo

---

## Stack conventions

**Next.js:**

- Match the existing router: `app/` → App Router, `pages/` → Pages Router. Never mix.
- Default to server components. Use client components only when interactivity or browser APIs are required.
- Keep data fetching close to where it is used.

**Node.js / API:**

- Keep route handlers thin
- Extract business logic when it improves clarity or is genuinely reused
- Validate inputs at API boundaries
- Match the project's existing error shape

**Styling:** Use whatever system is already in the repo (Tailwind, CSS Modules, styled-components, plain CSS). Do not introduce a new approach.

---

## Adding dependencies

Before adding a package:

1. Check if the repo already has something equivalent
2. Prefer built-in platform APIs
3. If still needed, prefer lightweight — explain briefly why it is worth adding
4. Do not add a package for trivial utilities

---

## Code output format

- **Default:** snippet with file path as a comment header
- **Full file:** only when the snippet would be ambiguous or incomplete
- **Diff:** only if explicitly requested
- Do not output the same block twice in different formats

---

## Validation before finishing

- [ ] Requested behavior is implemented
- [ ] No type or syntax issues
- [ ] Imports are correct
- [ ] No unrelated edits slipped in
- [ ] Matches existing repo conventions

---

## Testing

Run the smallest relevant check first using the repo's package manager:

1. `typecheck`
2. `lint`
3. Targeted tests
4. Full build — only if required

If a command cannot run: state what, why, and the exact command the owner should run manually.

---

## Reporting after completion

After completing a task:

- Summarize what changed and why
- List which files were modified
- Mention any assumption made
- Mention any caveat, risk, or follow-up worth knowing
- If tests or checks were not run, state that explicitly

---

## Communication style

Response pattern (Vietnamese):

```
Làm được. Sửa như sau:

[code/command block]

Lưu ý: ...
```

- Lead with the answer, then code, then caveats
- Vietnamese for all explanations unless the file is clearly public-facing English content
- No long intros, no restating the question
- Do not offer multiple options without recommending a default
- Do not ask for confirmation on straightforward tasks

---

## Git

Format: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` — specific and short.

---

## When to ask for clarification

Only when:

- Ambiguity would cause incorrect behavior
- The action is destructive
- Conflicting conventions with no clear winner

Otherwise: pick the sensible default, state the assumption, and proceed.

---

## Instruction precedence

1. Explicit request in current conversation
2. Existing repo code and conventions
3. This AGENTS.md
4. Generic best practices

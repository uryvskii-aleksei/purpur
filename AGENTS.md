# AGENTS.md — Purpur

Purpur («Пурпур») combines a chocolate factory website with a reusable agent harness for a virtual IT department. Human setup and project status are in [README.md](README.md). The current website is static HTML, CSS and JavaScript in `apps/site/public/`, with Node.js behavior tests. Do not introduce a framework, package manager or backend without a task that needs it.

## Instructions and runtime files

Keep one source per rule: shared requirements here, procedures in `.agents/skills/`, responsibilities in `.agents/roles/`. Files in `.cursor/`, `.claude/` and `.codex/` are static pointers and metadata. Keep them aligned. Roles inherit the user's model and reasoning settings.

| Runtime | Rules | Skills | Roles | Hooks |
| --- | --- | --- | --- | --- |
| Cursor | `AGENTS.md` | `.claude/skills/*/SKILL.md` pointers | `.cursor/agents/*.md` | `.cursor/hooks.json` |
| Claude Code | `CLAUDE.md` → `@AGENTS.md` | `.claude/skills/` | `.claude/agents/*.md` | `.claude/settings.json` |
| Codex | `AGENTS.md` | `.agents/skills/` | `.codex/agents/*.toml` | `.codex/hooks.json`, subject to runtime support |

The only hook is format-touched. It uses an installed local Prettier and reports a skipped formatter without blocking edits. MCP connections, credentials and personal runtime settings stay outside version control. Missing integrations block only their dependent operations. Do not assume that committing role or hook files enables unsupported runtime features.

For this Mac's active input incident, follow the [desktop input isolation](.agents/skills/operations/references/desktop-input-incident.md) before any UI automation. This restriction survives dialog and runtime restarts.

## Scope and authority

- Preserve unrelated edits. Make the smallest sufficient change and reuse settled decisions. Resolve consequential choices through [design-and-docs](.agents/skills/design-and-docs/SKILL.md). Keep independent work moving.
- [dev-cycle](.agents/skills/dev-cycle/SKILL.md) distinguishes research, local implementation and delivery through a PR. Research prepares a concrete design for human review. Approval permits decomposition and handoff, while implementation requires its own user request. A bare task link or discussion starts neither workflow.
- Commit and push when requested or included in an authorized delivery workflow. A commit-only request excludes push. A request to upload work to this repository includes scoped commits and push. Planning alone does not authorize publication. Merge, destructive operations, task closure and external notifications need explicit authorization. Do not bypass PR policies implicitly.
- Re-read external targets immediately before writing, change only needed fields, preserve manual content and verify by reading back. Never include secrets or personal customer data in repository files or messages.
- This Git repository owns project tasks, plans, decisions and durable artifacts. Use [repository-tasks](.agents/skills/repository-tasks/SKILL.md) and the [task index](tasks/README.md). No external tracker is required. GitHub PRs deliver changes and reference the owning task.
- Do not calculate agent scores, effort analytics or self-improvement logs. Task status and assignments describe actual work, not presumed background activity.
- Select the owned [task worktree](.agents/skills/dev-cycle/references/task-worktree.md) before writes. Use the [delegation policy](.agents/skills/dev-cycle/references/parallel-work.md) when supported and authorized. No nested delegation.

## Virtual IT department

The human user is CTO. Use [department-workflow](.agents/skills/department-workflow/SKILL.md) for multidisciplinary routing, role handoffs and material CTO decisions. [Role contracts](.agents/roles/) own specialist responsibilities. Product value, business requirements, factual content, architecture, execution planning, QA and code review remain distinct responsibilities. Existing human authorization persists across role handoffs. Route only relevant specialists, not the entire department for every task. Preserve independent QA/review where required and never represent same-agent role switching as independent evidence.

For requests about backlog, team activity or continuation, update the owning task records from actual work and show a direct backlog view/link. Fix an observed harness/workflow gap within the authorized scope and keep its rule in the owning skill. Do not equate configured roles with running workers or promise autonomous background work that is not scheduled.

## Security

Validate inputs and sanitize user-controlled content and URLs. Client validation is not a security boundary. Use configured service clients and keep secrets server-side. Show useful failures without exposing internals. The website currently prepares a downloadable/email order request. Do not imply that it submitted, paid for or reserved an order. Never invent product claims, availability, prices, reviews or integrations.

## Quality and verification

- [build-and-test](.agents/skills/build-and-test/SKILL.md) owns verification. Select commands from actual manifests. Verify the integrated result, reuse valid evidence and preserve CI requirements. Run `npm test` for harness and shop behavior, and `npm run check` for script syntax.
- Every operation ends with actual results, evidence, skipped checks and blockers. Self-review is not independent review.
- Keep human documentation in Russian and agent instructions, roles, skills and references in English. Replies, comments, commit messages and PR text are Russian. Comments explain why. Use full stops rather than semicolons in prose.
- Keep README at the repository root and each application root. Number human documentation headings hierarchically: H2 `1.`, H3 `1.1.`, H4 `1.1.1.`. Put lasting contracts beside their owner, workflow instructions in the harness and release history in CHANGELOG.md.
- Department tasks keep their canonical plan, status and handoff in `tasks/<id>/README.md`. A PR’s `## План` references that plan under [plan format](.agents/skills/design-and-docs/references/plan-format.md). Chat updates do not replace durable records. Research designs use `docs/techprojects/<slug>/<slug>.md` and are linked from the owning task.
- Keep useful sanitized deliverables and verification evidence in `tasks/<id>/artifacts/`, with source revision and limitations. Keep caches, raw logs, temporary review bundles and experiments outside tracked sources. Preserve source assets, licenses, test fixtures and approved snapshots. Credentials and personal customer data stay outside Git.

## Project conventions

### Tooling, Git and dependencies

- Use Node.js 22 or newer for harness scripts and tests. The root npm scripts require no installed packages. Respect future application manifests and lockfiles. Add dependencies only when the authorized task needs them.
- The default base and PR target are `main`. Refresh `origin/main` before new task branches when a remote history exists. If the primary checkout is clean on `main`, use `git pull --ff-only`. Do not discard edits to reach a base. An empty repository may be bootstrapped on its unborn `main` without an empty commit or fabricated base SHA.
- Branches: `feature/<id>-<slug>`, or `bugfix/<id>-<slug>` for bugs and their tasks. Omit a missing ID. Slugs have 2–4 lowercase English kebab-case words. Release branches use `release/`. Continue an owned task branch without rebasing implicitly. Preserve explicitly requested historical release bases.
- After PR publication, return a primary checkout to `main` only when this chat owns it and it is clean. Linked worktrees stay on their task branch. Cleanup requires a separate request.

### Naming

Markdown uses lowercase kebab-case except conventional `README.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `SKILL.md`, `GLOSSARY.md` and `USAGE.md`. Preserve established code names and layouts. New application modules live in `apps/`, shared libraries in `packages/` only when there is actual reuse. Do not create empty workspaces or invent package names.

### Components and icons

Reuse local UI, icons and design tokens. Preserve Purpur's purple brand, accessible contrast, semantic HTML, keyboard navigation and reduced-motion behavior. Do not import a private design system from another project. Keep styling and component extraction consistent with the owning application. If React, SCSS modules or Storybook are introduced, use their actual configuration rather than assuming they exist.

### Logic and API

Keep pure calculations separate from DOM and side effects, with explicit inputs and no input mutation. Preserve public contracts and document changed APIs. The current shop separates catalog data (`products.js`), cart/filter logic (`store.js`) and UI (`app.js`). Keep product provenance and unknown-package order restrictions intact. Reuse existing state and service conventions. Do not impose Redux, sagas, i18next or a particular API client on an application that does not use them. Use strict types without `any` where TypeScript is configured.

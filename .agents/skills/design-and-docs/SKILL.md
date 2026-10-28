---
name: design-and-docs
description: >-
  Handle research, Spike results, requirements, technical designs, plans, documentation and handoff.
  Use for исследование, Spike, уточни требования, составь план, техпроект, задокументируй,
  clarify, grill, handoff, compact, сохрани прогресс, продолжим завтра, где остановились.
  Research, documentation or save-only requests do not start implementation.
---

# Design and Docs

| Request | Reference |
| --- | --- |
| Conduct research or a bounded Spike | [Research](references/research.md) |
| Resolve consequential ambiguity | [Clarification](references/clarify-requirements.md) |
| Create or update the canonical task plan | [Task plan](references/plan-format.md) |
| Author, review or import a technical design | [Technical designs](references/technical-design.md) |
| Document behavior or edit prose and diagrams | [Writing](references/document-writing.md) |
| Save interrupted work | [Handoff: save](references/session-handoff.md#save) |
| Resume work | [Handoff: resume](references/session-handoff.md#resume) |

Select the [task worktree](../dev-cycle/references/task-worktree.md) before saving files. Read the latest sources and preserve deliberate user edits. Use [simplify-solution](../simplify-solution/SKILL.md) when choosing a solution and reuse a valid assessment. Editorial edits and faithful imports need no redesign.

A design records lasting behavior and reasons in `docs/techprojects/<slug>/<slug>.md`. A [repository task](../repository-tasks/SKILL.md) owns authorization, acceptance, the single execution plan, decisions, checks and the next step. PRs link to that plan. Check affected links, examples and diagrams, report rendering or source limitations, then return to the calling workflow.

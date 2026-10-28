# Task plan

Department work keeps one canonical execution plan in `tasks/<id>/README.md` through [repository-tasks](../../repository-tasks/SKILL.md). The task also owns authorization, status, dependencies, acceptance, decisions, verification and the next step. Its PR links to that plan instead of copying it. A PR without a separate department task may keep its checklist in `## План`. Small local work without a department task or PR may keep its plan in chat.

## Start

Select the owned [workspace](../../dev-cycle/references/task-worktree.md). Read and preserve the task's direct authorization and settled decisions before planning. Research records findings in the task and lasting design in the linked [technical design](technical-design.md). Research and implementation launch separately. Design approval alone does not start implementation. An existing implementation request needs no repeated confirmation.

For authorized PR delivery, make a real scoped [commit](../../dev-cycle/references/commit.md), push and create a draft PR with `## Цель` and `## План`. Put a link to the canonical task plan in that section when a task exists. A planning-only request does not authorize commit or publication. A direct request to upload sources to an empty repository may bootstrap its `main` without a PR. Do not create empty commits or PRs for bookkeeping.

## Plan section

Keep numbered checklist items in dependency order, describing concrete outcomes and necessary verification:

```markdown
- [ ] 1. Конкретное изменение или результат.
```

Keep the goal brief and acceptance explicit in the owning task. Lasting technical decisions belong with the design, the actual human decision source and continuation state in the task. Avoid operational transcripts and per-agent activity records. Preserve the host's required PR fields and text limits.

## Progress

Mark an item complete only when its result exists and applicable checks support it. Identify the verified commit or saved source snapshot and dirty/new scope in the task. Distinguish local completion from publication so a checked item never claims an unperformed push or passed CI.

Keep the single checklist aligned with the final implementation rather than appending history. The coordinator maintains the task. Planner returns proposed text only. Explanation-only review rounds need no new plan items or commits. Re-read before external writes, preserve manual content and verify afterward.

## Finish

Record acceptance evidence, failures or skipped checks and the next action in the task. When PR delivery was authorized, link the canonical plan and report its actual commit, publication and CI state. Preserve the plan across review rounds. A completed checklist or PR handoff does not authorize task closure or merge.

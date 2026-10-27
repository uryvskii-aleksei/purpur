# Task plan in the PR

Implementation with a PR keeps one plan in its `## План` description section. Local tasks without a PR keep their plan in chat. Research records evidence, design, decomposition and continuation state in its [research record](research.md). Do not add repository plan files or empty PRs solely for bookkeeping.

## Start

Select the owned [workspace](../../dev-cycle/references/task-worktree.md). For authorized PR delivery, make a real scoped [commit](../../tfs-pull-requests/references/commit.md), push and create a draft PR with `## Цель` and `## План`. A planning-only request does not authorize commit or publication. A direct request to upload sources to an empty repository may bootstrap its `main` without a PR.

[Human design approval](technical-design.md#human-review-and-handoff) permits decomposition and handoff. Implementation still needs its separate launch.

## Plan section

Keep numbered checklist items in dependency order, describing concrete changes and necessary verification:

```markdown
- [ ] 1. Конкретное изменение или результат.
```

Keep the goal brief. Do not add operational transcripts, checkout state or handoff paragraphs around the checklist. Lasting decisions belong in a technical design, continuation notes in [session handoff](session-handoff.md). Honor the actual host's text limits. For TFS, follow its [text format](../../tfs-pull-requests/references/create.md#text-format) and 4000-character description limit.

## Progress

Mark completed items only after their changes are present in the pushed PR state. Batch scoped progress commits sensibly. Keep the checklist aligned with the final implementation rather than appending a transcript. Explanation-only review rounds need no new plan items or commits. The coordinator maintains the external plan, planner returns text only. Re-read before external writes and verify afterward.

## Finish

After the final push, close completed items and hand the PR to review when ready. Report checks, CI and remaining work accurately. Preserve the checklist across review rounds. A PR handoff does not authorize merging it or closing a task.

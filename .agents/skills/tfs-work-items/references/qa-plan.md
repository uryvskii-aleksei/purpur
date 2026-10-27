# Sibling QA plan

Use when finished development enters review, for an already-reviewed Task, on explicit QA requests or after material review fixes. Partial In Progress work does not trigger handoff.

1. Read direct children of the development Task's actual PBI/Impediment/Bug parent. Select QA Tasks by testing activity or title and matching scope. Never create one. Report absence and clarify ambiguous matches.
2. Fill only an [empty description](links-and-writing.md#empty-task-descriptions). Put proposed additions to a populated one in chat or the PR.
3. From the full PR diff, AC and evidence write 1–2 plain sentences: user-visible change, check action and expected result. Maximum 200 visible characters including labels and spaces, excluding HTML. Count before saving. Extra detail requires an explicit request. Omit implementation and publication metadata.
4. Re-check parent and relevance, then write only `System.Description` with a revision guard where supported. On conflict, skip if populated.
5. Report each sibling as filled, already populated, absent or needing clarification. A failed required read or write leaves handoff incomplete.

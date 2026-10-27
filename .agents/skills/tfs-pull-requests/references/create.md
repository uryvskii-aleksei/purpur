# Create in TFS

## Inspect and prepare

1. Verify repository, source and target. Default target is the configured repository base (`main` for Purpur). Resolve base ambiguity, fetch and inspect all commits and the merge-base diff.
2. Apply the [version guard](version-guard.md) and check final verification and review evidence.
3. Resolve WI IDs from task context, branch or commits and read their type, title, AC and parent. Link under [relation rules](../../tfs-work-items/references/links-and-writing.md#relations). Publishing without a WI requires an explicit user decision.

## Text format

Title: `<repo> (<package>): <Summary>`. Package is the workspace folder name without scope, comma-separated when several, or `repo` for repository-wide changes. Summary is a capitalized result-oriented noun phrase without WI IDs.

The description has exactly two headings, in this order:

- `## Цель`: the problem and delivered behavior.
- `## План`: the task plan under [plan format](../../design-and-docs/references/plan-format.md#plan-section).

Describe every change in the plan checklist. Do not add `## Изменения`, `## Проверка` or other sections. The plan contains only checklist items, without introductory or closing paragraphs. Report check results, CI status and operational context in chat and the relevant CI tools. Keep the goal short and the whole description within the TFS limit of 4000 characters. WI links belong in workItemRefs, not in text.

## Publish and verify

Push the source branch after the first commit under [plan start](../../design-and-docs/references/plan-format.md#start). Call `create_pull_request` with repository, title, description, `refs/heads/` source and target and numeric workItemRefs. Create as a draft (`isDraft: true`). Use `isDraft: false` only when every plan item is already closed and the PR is handed to review in the same step. Otherwise the PR leaves draft at [finish](../../design-and-docs/references/plan-format.md#finish).

Read back policies and WI/parent relations and add missing eligible links. Check [CI evidence](../../build-and-test/references/ci-evidence.md) after creation. State and QA handoff belong to [dev-cycle](../../dev-cycle/SKILL.md).

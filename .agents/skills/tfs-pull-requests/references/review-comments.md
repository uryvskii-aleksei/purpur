# Address PR comments

Resolve the PR and its owned [task worktree](../../dev-cycle/references/task-worktree.md) within the [publication boundary](../SKILL.md#publication-boundary).

## Fetch and triage

Read PR identity, `get_me` and all review threads. Call `get_pull_request_comments` with `top: 200` and expand saturated results to supported limits. Report incomplete or truncated results instead of claiming full coverage.

Compare `author.uniqueName` case-insensitively. Ignore system updates, closed AI summaries without file context and resolved threads. Threads whose latest relevant reply is ours await reviewer resolution. Process new feedback, including follow-ups. Reply to wontFix/byDesign only when disagreeing. Preserve thread IDs, file/line, bodies, severity and cross-references.

## Fix, verify and publish one round

1. For code fixes, add items to the PR `## План` section under [plan progress](../../design-and-docs/references/plan-format.md#progress). Explanation-only rounds change neither plan nor commits.
2. Fix actionable root causes, preserving accepted decisions. Verify through [build-and-test](../../build-and-test/SKILL.md). Do not commit a failing required gate.
3. Commit completed fixes. Commit bodies name the addressed thread IDs.
4. Push without force or amend and [refresh the PR](refresh.md).

## Reply and report

Reply preferably within eight lines. Lead with the completed change or the reason it will not be made. Add relevant file context, verification and related threads. Never include commit identifiers or links in PR comments. Preserve reviewer wording and severity when quoting. Do not duplicate earlier replies.

Leave thread status unchanged unless resolution was explicitly requested and a supported operation exists. Report handled and skipped threads, fixes, checks, commit/push result and unresolved threads. One round does not start a monitor.

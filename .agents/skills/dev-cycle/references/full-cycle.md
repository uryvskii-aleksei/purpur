# Implementation delivery

[dev-cycle](../SKILL.md) selects the route. This reference delivers authorized implementation, including repository documentation. Research ends through [research](../../design-and-docs/references/research.md). Read an approved design and handoff before implementing researched work.

1. Verify the integrated result. Fix failed required checks or report the unresolved failure and its impact.
2. If commits are authorized, inspect the full diff and create scoped commits under [commit](../../tfs-pull-requests/references/commit.md). A bounded local task stops with sources and evidence when publication was not requested.
3. For authorized publication, verify the current remote, branch and target, push without force and read back the remote SHA. Use the configured repository host. GitHub work does not invoke TFS tools. For a PR, include `## Цель` and the [plan](../../design-and-docs/references/plan-format.md), preserve unrelated manual text and verify the saved result. Attach created PRs to the chat when the runtime supports it.
4. Inspect applicable [CI evidence](../../build-and-test/references/ci-evidence.md). Report pending checks as pending rather than waiting indefinitely or claiming success.
5. For an explicit TFS assignment, follow [PR operations](../../tfs-pull-requests/SKILL.md), [states](../../tfs-work-items/references/states.md) and [QA handoff](../../tfs-work-items/references/qa-plan.md). For other hosts, use their configured task process only when requested.
6. Report the commit and publication result, PR when present, verification and remaining gaps. Do not infer merge, issue closure, release publication or permission to notify others.

Later feedback uses the current PR's review workflow. One delivery does not start a background monitor.

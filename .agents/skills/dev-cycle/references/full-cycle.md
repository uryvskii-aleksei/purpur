# Implementation delivery

[dev-cycle](../SKILL.md) selects the route. This reference delivers authorized implementation, including repository documentation. Research ends through [research](../../design-and-docs/references/research.md). Read the task's authorization, accepted design and handoff before implementing researched work.

1. Verify the integrated result. Fix failed required checks or report the unresolved failure and its impact.
2. Record acceptance evidence, checks and the next step in the [repository task](../../repository-tasks/SKILL.md). If commits are authorized, inspect the full diff and create scoped commits under [commit](commit.md). A bounded local task stops with sources and evidence when publication was not requested.
3. For authorized publication, verify the current remote, branch and target, push without force and read back the remote SHA. Use the configured repository host. For a PR, include `## Цель` and a link to the canonical task [plan](../../design-and-docs/references/plan-format.md). A PR without a separate department task may carry its checklist. Re-read before external writes, preserve unrelated manual text and verify the saved result. Attach created PRs to the chat when the runtime supports it.
4. Inspect applicable [CI evidence](../../build-and-test/references/ci-evidence.md). Report pending checks as pending rather than waiting indefinitely or claiming success.
5. Preserve assigned QA and review responsibilities and update the task with the integrated source identity, verification gaps and next action. Move a task to `done` only within explicit closure authorization. Readiness for review alone does not grant that authority.
6. Report the commit and publication result, PR when present, verification and remaining gaps. Do not infer merge, issue closure, release publication or permission to notify others.

For later review feedback, read the current PR, threads, task and source state. Fix supported in-scope findings, record unsupported findings with evidence, rerun affected checks and publish only within authorization. Mark a thread resolved only after its issue is addressed and the requested external update is authorized. One delivery does not start a background monitor.

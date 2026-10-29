---
name: repository-tasks
description: >-
  Read, create and maintain Purpur tasks, backlog, defects, assignments, plans and durable
  task artifacts as versioned files in this Git repository. Use for task status, backlog
  analysis, bug registration and handoff. Task registration does not authorize implementation.
---

# Repository tasks

Use [the task index and record contract](../../../tasks/README.md). Canonical records live in `tasks/<id>/README.md`. Reuse a matching task and check dependencies before creating another. Keep the index as navigation rather than a second status/plan database.

Respect the task phase: current work retains manager-mediated payments. Future-store implementation does not start merely because its record exists. Research can continue without changing payment behavior.

Read the owning record, current sources and direct user authorization. Distinguish observed defects from unverified reports, requested outcomes from proposals, role recommendations from actual assignments, and current workers from the configured roster. A past run or a role file is not proof of ongoing work.

For backlog or team-status requests, link the [task index](../../../tasks/README.md) and, when `gh` is available, the GitHub issues of this repository. Do not start the local HTML board. A new CTO request in chat is registered in the matching `tasks/<id>/README.md` before the reply ends, so it is not left only in the conversation. Material questions waiting for the CTO live in [the decision inbox](../../../tasks/cto-inbox/README.md). Update that inbox in the same turn that opens or closes a question. Ask those questions with the structured choice form above the input, the recommended option first. Do not add a timer, expiry or countdown, and do not replace the form with a prose list of options. Continue independent work while they are unanswered. When Jira is readable, link the same item there and do not keep a third copy. Register a concrete requested change in its matching task before execution, update its result/assignment/next action before handing back, and preserve this evidence for future dialogs. Do not create a duplicate activity database.

For status requests, reconcile the record with Git, actual worker state and available verification evidence. Report inaccessible systems and stale evidence. Do not invent work, completion or approvals to fill a backlog.

Coordinator maintains status, ownership, decisions, plan and handoff. Workers return evidence under their assigned scope. Use [department-workflow](../department-workflow/SKILL.md) for routing and [dev-cycle](../dev-cycle/SKILL.md) for authorized execution. A researched implementation still needs its own user launch. Reuse existing authorization for ordinary work within its scope.

Keep one plan in the task. PRs link to it. Enduring technical designs stay in their existing `docs/techprojects/` source. Useful sanitized deliverables belong in `tasks/<id>/artifacts/` with source identity, date and limitations. Keep temporary review packages and raw diagnostics outside Git. Never store credentials, personal customer records or authorization codes in task files.

Mark blockers only when they prevent that task's next action. Continue independent tasks. Completion evidence, independent review and business acceptance remain distinct. Honor actual permission for closure, publication and deployment. Creating a record or moving a status never grants these permissions.

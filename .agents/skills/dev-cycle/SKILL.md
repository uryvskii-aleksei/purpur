---
name: dev-cycle
description: >-
  Conduct research through human design review and prepare a handoff, or implement
  an authorized task with verification and optional PR delivery. Use for исследуй задачу,
  проведи Spike, plan and code, implement with review, реализуй задачу or a delivery cycle.
  Also use for commit, закоммить, create PR and address PR comments.
  A task link alone does not start implementation. Research and implementation launch separately.
---

# Dev Cycle

| Request | Reference |
| --- | --- |
| Research, Spike or technical design | [Research](../design-and-docs/references/research.md) |
| Deliver implementation | [Full cycle](references/full-cycle.md) |
| Create a local commit | [Commit](references/commit.md) |
| Select or clean up a workspace | [Task worktree](references/task-worktree.md) |
| Delegate or obtain independent review | [Parallel work](references/parallel-work.md) |

For multidisciplinary work, use [department-workflow](../department-workflow/SKILL.md) to select specialists and apply its [handoff contract](../department-workflow/references/handoffs.md). Keep this skill as the delivery owner.

## Choose the route

Identify the requested outcome and authorization before acting. Purpur keeps department tasks in `tasks/<id>/README.md` through [repository-tasks](../repository-tasks/SKILL.md). Read the task, repository documentation and existing decisions. GitHub and `main` are the configured publication host and default base. Local work needs no external task service.

Research produces evidence, a concrete recommendation and, when needed, a lasting technical design. Present material unresolved choices for human review, record the actual decision in the task and prepare the next steps and handoff. Research and implementation launch separately. Design approval alone does not launch implementation or authorize messaging another chat. Preserve an implementation request already given by the user instead of asking for it again. A bounded, well-understood change needs no invented research gate.

Local implementation ends with changed sources, applicable checks and a report. Publish commits or a PR when requested or included in the authorized delivery scope. A repository bootstrap may start on unborn `main` without an empty commit. Planning alone does not authorize commit, push or PR creation.

## Implement

1. Select the owned [workspace](references/task-worktree.md). Read the task's authorization, acceptance, dependencies and relevant contracts. Maintain its single [plan](../design-and-docs/references/plan-format.md). For authorized PR delivery, create a draft once there is a real scoped commit and link to the canonical task plan.
2. Resolve consequential choices through [design-and-docs](../design-and-docs/SKILL.md), reusing approved decisions. Assess the approach with [simplify-solution](../simplify-solution/SKILL.md).
3. Author directly or delegate under [assignments](references/parallel-work.md#assignments), respecting available capabilities and file ownership.
4. Verify the integrated state through [build-and-test](../build-and-test/SKILL.md). Behavior changes need an independent `full` review when available. Mechanical edits may use `diff`, designs use `artifact`. Report a missing independent review honestly.
5. Fix supported findings and rerun affected checks. Continue [delivery](references/full-cycle.md) within the requested scope, then report outcome, evidence, gaps and publication state.

Preserve the task's assigned development, QA and research responsibilities. Deliver dependent tasks in order and record results and the next action in their owning records. A PR without a separate department task may keep its checklist in the PR. Task closure, merge and publication stay within direct user authorization.

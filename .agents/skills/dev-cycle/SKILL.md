---
name: dev-cycle
description: >-
  Conduct research through human design review and prepare a handoff, or implement
  an authorized task with verification and optional PR delivery. Use for исследуй задачу,
  проведи Spike, plan and code, implement with review, реализуй задачу or a delivery cycle.
  A task link alone does not start implementation. Research and implementation launch separately.
---

# Dev Cycle

| Request | Reference |
| --- | --- |
| Research, Spike or technical design | [Research](../design-and-docs/references/research.md) |
| Deliver implementation | [Full cycle](references/full-cycle.md) |
| Select or clean up a workspace | [Task worktree](references/task-worktree.md) |
| Delegate or obtain independent review | [Parallel work](references/parallel-work.md) |

## Choose the route

Identify the requested outcome and repository host before external operations. Purpur uses GitHub and `main`, see [configuration](../../../README.md#4-интеграции). Read local documentation and existing decisions. Use [tfs-work-items](../tfs-work-items/SKILL.md) only for an explicit TFS assignment. No TFS connection is required for local or GitHub work.

Research produces evidence, a concrete recommendation and a technical design for human review. After approval, prepare decomposition and durable handoff, then finish the research chat. Approval does not launch implementation or authorize messaging another chat. A separate user implementation request starts that work. A bounded, well-understood change needs no invented research record.

Local implementation ends with changed sources, applicable checks and a report. Publish commits or a PR when requested or included in the authorized delivery scope. A repository bootstrap may start on unborn `main` without an empty commit. Planning alone does not authorize commit, push or PR creation.

## Implement

1. Select the owned [workspace](references/task-worktree.md). Read requirements and relevant contracts. For authorized PR delivery, create a draft once there is a real scoped commit and maintain its [plan](../design-and-docs/references/plan-format.md).
2. Resolve consequential choices through [design-and-docs](../design-and-docs/SKILL.md), reusing approved decisions. Assess the approach with [simplify-solution](../simplify-solution/SKILL.md).
3. Author directly or delegate under [assignments](references/parallel-work.md#assignments), respecting available capabilities and file ownership.
4. Verify the integrated state through [build-and-test](../build-and-test/SKILL.md). Behavior changes need an independent `full` review when available. Mechanical edits may use `diff`, designs use `artifact`. Report a missing independent review honestly.
5. Fix supported findings and rerun affected checks. Continue [delivery](references/full-cycle.md) within the requested scope, then report outcome, evidence, gaps and publication state.

For a TFS PBI, preserve existing child development, QA and research Task responsibilities. Deliver development Tasks in dependency order, normally one scoped PR per development Task. Follow the TFS skills for actual work-item states and QA handoff. Do not apply TFS types or state names to GitHub issues.

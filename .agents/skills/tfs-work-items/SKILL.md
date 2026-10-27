---
name: tfs-work-items
description: >-
  Work with TFS items: read context, maintain scoped research PBIs and Spike Tasks,
  start a WI branch, manage task states, decompose work, link PRs, or fill empty
  task descriptions and sibling QA plans.
  Use for WI IDs/links, start work, update tasks, task status, decomposition and QA hand-off.
  Feature edits are limited to scoped PBI hierarchy.
---

# TFS work items

Use the configured TFS integration and [integration configuration](../../../README.md#4-интеграции). Resolve each WI's project and area from its URL or fields.

| Request | Reference |
| --- | --- |
| Read context or start a branch | [Context and branch](references/context-and-branch.md) |
| Change state | [States](references/states.md) |
| Hand finished work to QA | [QA plan](references/qa-plan.md) |
| Create scoped PBIs/Tasks or prepare research decomposition | [Decomposition](references/decomposition.md) |
| Link items/PRs or maintain authorized descriptions | [Links and writing](references/links-and-writing.md) |
| Research, record Spike results or review a technical design | [Research](../design-and-docs/references/research.md), [technical designs](../design-and-docs/references/technical-design.md) |

## Shared boundaries

Create and maintain PBIs and Tasks only within the authorized assignment. Feature research and its approved implementation decomposition must attach their PBIs as Children of the source Feature under the [PBI hierarchy procedure](references/links-and-writing.md#pbi-hierarchy-under-a-feature). All other Feature fields, states and relations stay read-only. Never create Features or Impediments or change Impediment states. Adjacent-team work stays human-managed. Preserve existing title, assignee, iteration, area and unrelated fields unless requested.

Research uses a PBI titled `Исследование: …` with the canonical technical design in `System.Description`. Spike Tasks use `Spike: …` and record their question, evidence and conclusion. Apply the narrow [description update rules](references/links-and-writing.md#maintained-work-results). Human review must identify the reviewed design revision and decision source. An agent cannot approve a design or infer approval from WI state.

Research and Spike work without repository changes needs no branch, worktree, empty commit, PR, CI or QA handoff. Its readiness follows the [research result and human review](../design-and-docs/references/research.md). Closing any item still requires explicit human authorization. Implementation follows the ordinary PR cycle. The transition from Feature research requires design approval and a separate implementation chat. A known, bounded implementation task may start directly when research is unnecessary.

PR operations belong to [tfs-pull-requests](../tfs-pull-requests/SKILL.md), implementation to [dev-cycle](../dev-cycle/SKILL.md).

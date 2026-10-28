# Parallel work

## Delegation threshold

The coordinator may author small, cohesive changes directly, including behavior, regression tests and local refactoring, when the expected outcome, affected dependencies and verification are understood. Human documentation, harness instructions and handoff records may also be authored directly. File count alone does not require delegation. Resolve consequential uncertainty through [design-and-docs](../../design-and-docs/SKILL.md) before dependent work.

Delegate when a bounded assignment protects the coordinator's context, needs narrower tools, provides independent review or enables useful parallel work. Use coder for implementation that needs its own focused context or responsibility. Use planner for consequential design choices, cross-module dependencies or substantial investigation. Routine lifecycle steps alone do not require planner. The coordinator maintains the single [plan](../../design-and-docs/references/plan-format.md), authorization, assignments, decisions and evidence in the [repository task](../../repository-tasks/SKILL.md). PRs link to that plan. Planner and reviewer remain read-only.

The coordinator owns assignments, acceptance, integrated verification and authorized Git and external operations. Each author edits only their owned files, including lint or format fixes. Transfer ownership explicitly before another author changes them. Verification commands may create outputs under [artifact rules](../../../../AGENTS.md#quality-and-verification).

## Context and tool boundaries

Choose who will read the details before loading large source sets, logs or investigation output. Delegate a self-contained investigation with the goal, owned scope, necessary decisions, source references and expected evidence. When supported, start it without the parent's full history. Preserve the user's model and reasoning settings. Return concise conclusions, changed paths, checks and unresolved questions instead of raw intermediate output. The coordinator reads the sources needed to validate and integrate the result.

Starting a subagent does not remove material already loaded into the parent's context. Before context compaction or transfer, save unfinished work through the existing [session handoff](../../design-and-docs/references/session-handoff.md). Resume from that plan and reconcile it with the actual workspace instead of repeating settled investigation. Do not add context metrics or separate progress logs.

Tool restrictions must match the runtime's actual capabilities. Role instructions and file ownership are behavioral boundaries, not technical isolation. Apply supported tool restrictions when an assignment needs narrower access. Codex custom agents inherit parent permissions and MCP servers. Their supported feature switches can disable capabilities, but a role file cannot provide a separate sandbox or arbitrary MCP allowlist. If required isolation is unavailable, report the blocked assignment and continue independent work.

## Assignments

Delegate dependent work sequentially and independent work in parallel when useful. Maximum: one coordinator plus three workers, capped by the runtime. Workers do not delegate further. If delegation is unavailable, the coordinator may still perform work within the direct-authoring criteria. Report assignments that require unavailable capabilities and continue independent work.

Each assignment supplies the absolute workspace and branch, outcome, owned files, dependencies, relevant decisions, role, existing evidence and expected checks, and states that other workers are active and their edits must be preserved. Workers use the selected workspace and never create or switch branches, mutate Git/index or call external integrations. A shared file belongs to one worker at a time.

Workers return changed paths, results, risks and verification evidence. The coordinator returns fixes to the responsible author or explicitly transfers ownership and validates the integrated tree through [build-and-test](../../build-and-test/SKILL.md). Direct authoring preserves the same applicable checks and independent review requirements as delegated implementation.

## Review handoff

For a research or design artifact without a code diff, supply `artifact` mode with a saved snapshot outside the repository, task/document paths and Git revision or saved snapshot identity, requirements and evidence. The reviewer checks the answer, alternatives, assumptions, contracts, scenarios, decomposition and handoff as applicable. Missing evidence leaves the corresponding conclusion unverified. Artifact review does not approve the design on the human's behalf or replace the implementation's code review. Record its conclusions and source identity in the task, with useful sanitized durable evidence in `tasks/<id>/artifacts/` when needed.

Before launching the reviewer, save `git diff <base>...HEAD`, `git diff`, `git status --porcelain` and new file contents when needed to a file in a temporary directory outside the repository. Supply `diff` or `full` mode, the absolute path of that file, exact base/HEAD, dirty/new files, requirements and verification evidence. The [reviewer](../../../roles/reviewer.md) reads the diff file and workspace sources, runs its own commands only where the runtime allows and never produces the diff itself. A refusal or missing diff file leaves review incomplete. Return confirmed defects to the responsible author, reject unsupported findings with evidence and re-review affected risks proportionally.

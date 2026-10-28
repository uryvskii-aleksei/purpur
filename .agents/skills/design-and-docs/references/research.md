# Research and Spike

[dev-cycle](../../dev-cycle/SKILL.md) selects the requested route. Use this reference for an authorized investigation or a bounded technical question inside authorized work. A task link or discussion alone supplies context. Research and implementation need separate user requests. Preserve an implementation request already given by the user and return to it after an in-scope Spike without asking for permission again.

## Scope and records

Read the request, owning [repository task](../../repository-tasks/SKILL.md), repository documentation, accepted designs and relevant dependencies. Reuse existing research and evidence. Record the question, scope, direct authorization and its limits, acceptance, useful evidence and stopping condition in `tasks/<id>/README.md`. Substantial department research belongs in a task, not an external tracker or a second plan. A small standalone clarification may finish with its answer and evidence in chat.

Bound autonomous work to a concrete question and relevant sources or experiments. Honor the supplied research limit. Do not expand scope or prolong an inconclusive investigation indefinitely. Batch nonblocking questions for the decision handoff. Pause dependent work only for a consequential unresolved choice or unavailable prerequisite, and continue independent work.

| Deliverable | Result |
| --- | --- |
| Research | Real alternatives compared against the same constraints when alternatives are needed, evidence, recommendation and consequences. Do not invent an option to fill a template. |
| Bounded Spike | One concrete question, reproducible check or authoritative source, answer, limits and next action. Compare alternatives only when the question needs it. |

Create separate dependent tasks only when scope, responsibility, evidence or stopping conditions justify them. Keep focused checks in the existing task otherwise. If an option changes, update its conclusions and the affected design while preserving evidence for rejected options.

## Evidence and experiments

Separate observed facts, proposals and unverified assumptions. A disproved hypothesis is useful when supported by evidence. Missing access or data is an incomplete check, not proof that an approach fails. At the stopping condition, preserve what is known, the exact gap and a proposed next decision. Do not report unresolved research as ready for implementation.

Keep findings concise: question, evidence or evaluation, conclusion, rationale, unverified checks and next action. Link authoritative sources and include enough information to reproduce important checks. A temporary file path alone is not durable evidence. Record decisions and verification in the task. Useful sanitized durable files may live in `tasks/<id>/artifacts/`. Keep raw logs, caches, prototypes, temporary screenshots and review bundles outside tracked sources. Do not create agent activity or performance logs.

Use bounded assignments only under [parallel work](../../dev-cycle/references/parallel-work.md). Repository changes follow workspace and verification rules. A prototype does not become approved product code merely because it works. No empty commit, PR or publication is required to record research.

## Recommendation and review

When the result establishes lasting behavior or shared contracts, maintain one [technical design](technical-design.md) in `docs/techprojects/<slug>/<slug>.md` and link it from the task. Keep the plan, research evidence, authorization, decisions and continuation state in the task. Link detailed evidence instead of copying investigations into the design.

Cover affected boundaries and contracts, important scenarios, failures, compatibility, verification and material risks as applicable. Obtain independent artifact review for a substantive design when available and report missing independence honestly. Resolve technical questions the agent can verify before presenting a decision. Agent review does not provide human approval.

Present a concrete recommendation and only material unresolved choices to the human. Record the actual answer, source, scope, conditions and reviewed document revision or saved snapshot in the task. Reuse settled decisions and direct authorization. A bounded Spike or routine decomposition within accepted boundaries needs no separate approval stage. If a change exceeds those boundaries, prepare the concrete amendment and its consequences before asking about that changed part. Silence is not approval.

## Finish and transfer

Record the answer, checks, remaining limits and next action in the task. For a research launch, prepare a cohesive implementation handoff with the accepted design, dependencies, proposed outcomes and verification. Use the single task [plan](plan-format.md) and create linked implementation tasks only when needed. Do not duplicate the plan in a PR or the technical design.

Finish the requested research after delivering its result and handoff. Design approval alone does not start implementation, open a new chat or authorize messaging another chat. A separate implementation request starts that work, and an existing direct implementation request remains valid. An in-scope Spike inside implementation returns to the already authorized task unless a material unresolved decision prevents dependent work.

A no-go recommendation may finish the research result without implementation. Report unverified checks and unresolved decisions accurately. Task closure, commit, push, PR creation and external notifications remain within direct user authorization. Report the result in the current chat without inventing a requirement to send an announcement.

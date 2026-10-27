# Research and Spike

## Local and GitHub research

This is the default route for Purpur. Read the request, repository documentation and existing decisions. Bound the question, evidence and stopping condition. Compare real alternatives when the question needs alternatives. Distinguish observed facts, proposals and unverified assumptions. Missing access is not evidence that an option fails.

For a substantial research launch, keep one canonical record in `docs/techprojects/<slug>/<slug>.md` with the design, source links, conclusions, open checks and next action. Use temporary directories for experiments. Request independent artifact review when available and report its absence when unavailable. Present a concrete recommendation for human review. Record the reviewed revision and direct human decision source. After approval, save a cohesive implementation decomposition and handoff in the record, then finish the research chat. A separate implementation request starts product work. A standalone bounded Spike may finish with its answer and evidence in chat.

No TFS item, external write, branch, empty commit or PR is required merely to research. Repository changes and publication still follow the task's authorization. The following detailed route applies only to explicitly selected TFS work.

## TFS research route

Use for an authorized research launch or technical uncertainty inside an authorized task. A bare WI link or discussion only reads context. [dev-cycle](../../dev-cycle/SKILL.md) selects the route. [tfs-work-items](../../tfs-work-items/SKILL.md) owns item creation, links, writing and states.

## Scope and evidence

Read the source Feature or PBI, its requirements, existing decisions, relevant repositories and sibling work. Reuse an existing research PBI and matching Spike Tasks before creating more. For a source Feature, attach and verify the research PBI as its Child through the [PBI hierarchy procedure](../../tfs-work-items/references/links-and-writing.md#pbi-hierarchy-under-a-feature). Feature fields, states and unrelated links remain read-only. Reference the source item from the research PBI description.

Make the question, mandatory constraints, useful evidence and stopping condition explicit. Honor a supplied research limit. Bound autonomous Spike work to a concrete technical question and relevant sources or experiments. Do not expand scope or prolong an inconclusive investigation indefinitely. Batch nonblocking questions for the planned design review. Pause dependent work earlier only for a consequential missing decision, scope change or unavailable prerequisite. Silence is not approval.

| Deliverable | Required result |
| --- | --- |
| PBI `Исследование: …` | At least two real options compared against the same constraints, evidence, recommendation and consequences. Rejected options may be real alternatives with demonstrated limitations. Never invent an option to fill a template. |
| Task `Spike: …` | One concrete question, reproducible check or authoritative source, answer, limits and next action. Compare options only when the question needs it. |

Keep Spike results concise: question, findings or evaluation, and conclusion with rationale and unverified checks. Use compact source links and refer to an existing technical design instead of repeating its behavior. Omit investigation transcripts and implementation checklists.

When options need different sources, experiments or stopping criteria, give each option a focused Spike and compare their results in the research PBI. Reuse existing items and honor the user's requested grouping. Keep each Spike's scope, title and conclusion aligned with the actual alternative. When consolidating Spikes, fold supporting checks into the relevant option. Do not create separate Spikes for a comparison that needs no independent checks. When an option or the chosen approach changes, update the affected Spike conclusions and the canonical design together, preserving evidence for rejected options.

Separate observed facts, proposals and unverified assumptions. A disproved hypothesis is a useful result when supported by evidence. Missing access or data is an incomplete check, not proof that an approach fails. At the stopping condition, preserve what is known, the exact gap and a proposed next decision. Do not report unresolved research as ready for implementation.

Use focused assignments under [parallel work](../../dev-cycle/references/parallel-work.md), keeping analysis read-only and delegating bounded experimental code when useful. Keep temporary logs and prototypes outside the repository under the artifact rules. Preserve the evidence needed to understand and reproduce conclusions in the Spike result. A temporary file path alone is not durable evidence. Repository changes follow the normal workspace, checks and PR rules and do not turn a prototype into approved product code.

A standalone Spike ends with its answer, evidence and proposed next action. An in-scope Spike embedded in implementation returns to the authorized task unless it changes an approved decision materially. Neither requires a new research PBI, full technical design or separate human review just to answer one technical question. The design-review package below applies to a Feature or PBI research launch.

## Prepare the review package

Maintain the canonical [technical design](technical-design.md) in the research PBI description. Link Spike results instead of copying their full investigations. Cover affected repositories, boundaries and shared contracts, important scenarios, failures, compatibility, verification and material risks as applicable.

Keep product implementation and its decomposition unstarted. Research PBIs and Spike Tasks may be created as needed for the investigation. Resolve technical issues the agent can verify and run independent substantive review of the technical design through the [reviewer](../../../roles/reviewer.md) before asking the human to review it. Agent review cannot replace human design approval.

The normal research launch has one planned human review of the technical design. Individual Spike results remain available for questions without a mandatory separate approval for each one. Present a concrete recommendation and remaining decisions. If the human requests changes, update the design and maintain its `Решения` section under [technical designs](technical-design.md#content), then return it for review.

## Finish and transfer

Record explicit human approval of the reviewed technical design. After approval to proceed, prepare [decomposition](../../tfs-work-items/references/decomposition.md) into one or more implementation PBIs distinct from the research PBI, each with its own child Tasks. Follow the business-value and Task-granularity rules there. Keep the design and conclusions in the research PBI and save the durable [handoff](technical-design.md#human-review-and-handoff) with links to those implementation PBIs, dependencies, outcomes and checks. Decomposition that follows the approved design needs no additional human approval. If it exposes a material design change, prepare that amendment for human review before dependent decomposition. Then end the research chat. Do not start product implementation, create a new chat or message another chat merely because the design was approved. A separate user request in another chat starts implementation against an implementation PBI or Task.

A no-go decision may complete the research result without implementation decomposition or product implementation. Report incomplete checks and unapproved decisions accurately. WI closure still needs explicit authorization and follows [states](../../tfs-work-items/references/states.md).

Prepare a concise announcement with the result, reason, WI link and follow-up work. Send it to a team channel only with explicit authorization. Otherwise report that the announcement is prepared but not sent. A PR notification or a reply in the current chat does not establish that the team was notified.

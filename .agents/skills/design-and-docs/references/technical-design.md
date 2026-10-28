# Technical designs

## Storage

The canonical design is `docs/techprojects/<slug>/<slug>.md`. Keep lasting behavior, boundaries, contracts and their reasons there. The owning [repository task](../../repository-tasks/SKILL.md) links the design and owns the plan, authorization, actual human decision source and reviewed revision, verification, dependencies and next action. Link evidence at its owner instead of duplicating it.

Identify the document path and Git revision, or an identified saved snapshot before the first commit. A decision record describes a real human decision and never creates one. Task closure, merge and publication are separately scoped actions.

Repository-owned API and component documentation stays with its code and links the common design where needed. Preserve existing imports in `docs/techprojects/<slug>/<slug>.md` and their optional `assets/` until a migration is requested. Preserve an imported kebab-case slug and source URL. On layout-only moves preserve names and content and repair links.

## Content

Resolve consequential choices through [clarification](clarify-requirements.md) and [research](research.md). Follow [writing conventions](document-writing.md). Use this concise structure:

- `Кратко`: the goal and chosen solution in a short opening summary.
- `Интерфейс`: controls and visible behavior.
- `Архитектура`: the chosen solution's responsibilities, data sources and boundaries.
- `Сценарии`: user triggers, calls and observable results.
- `Контракты`: changed methods and data formats, with minimal examples.
- `Решения`: concise answers to questions resolved with the user during design review, with the reason for each choice.

Number headings under the repository conventions. Keep every section brief and add subsections only when needed. Define recurring domain terms once and use them without repeating their qualifications. Link detailed research evidence from its task or sanitized `tasks/<id>/artifacts/`. Leave checkout state, tool transcripts, review chronology, announcements and implementation checklists out of the design body. Describe implementation internals only when needed to assess a material decision or contract. Implementation progress, research continuation state and actual decision provenance belong in the task.

- Start each scenario with its trigger and follow causal order through controls, actors, calls and results.
- Verify methods, routes, ownership and side effects against implementation or authoritative documentation. Label proposals and unverified claims.
- Keep contracts to required formats, invariants and minimal examples. State relevant failure, cancellation and asynchronous-update behavior briefly. Link unchanged contracts instead of copying schemas.
- Introduce entities, IDs, storage and API calls only for agreed scenarios. Existing adjacent controls or implementation capabilities do not expand the task's scope. Keep terminology at its owning source.

Preserve manual edits, deliberate omissions and source decisions in faithful imports. Keep editable visual sources.

Keep each detail in one owning section and reference it elsewhere. In `Решения`, record only agreed choices affecting behavior, architecture, contracts or scope, with brief reasons and relevant rejected alternatives, including scope exclusions. Preliminary comparisons remain research evidence. Editorial wording fixes do not create decision entries. When meaning changes, update the existing decision, affected design sections and Spike conclusions. Omit repository or file inventories unless they explain a material responsibility or boundary.

## Validate and deliver

Walk through the important scenarios and verify prerequisites, identifiers, ownership, recovery, links and examples. Obtain independent artifact review for substantive designs when available and report missing independence. Editorial changes need document checks. Record actual source identity, local and publication status and verification gaps in the task.

## Human review and handoff

Present material unresolved design choices to the human with a concrete recommendation, evidence, consequences and dependent work. Record the actual decision once in the task with the reviewed document revision or saved snapshot, decision source, scope, conditions and unresolved limits. Link the same design from dependent tasks without duplicating its content or decision record. Do not infer approval from a task status, agent review or silence. Reuse existing decisions and direct authorization.

Keep the implementation handoff in the owning task: accepted design reference, direct authorization and its limits, dependencies, intended outcomes, necessary checks, remaining risks and next action. Reuse its single plan and create linked implementation tasks only when responsibility or dependency boundaries justify them. Routine decomposition within accepted boundaries needs no new human approval. Link authoritative evidence and preserve sanitized durable artifacts when needed. Essential instructions must survive beyond the chat and temporary files.

Finish the research request after delivering the result and handoff. Research and implementation launch separately. A design decision alone does not start implementation or messaging another chat. An implementation request already given by the user remains valid. Before dependent implementation, read the task, accepted design and handoff and verify the current design against the accepted content. Metadata or handoff updates alone do not invalidate the decision. If accepted content or the decision source cannot be recovered, obtain the missing evidence instead of assuming it.

Changes to requirements, chosen approach, shared contracts or material accepted risks need renewed human review of the changed part. Prepare the actual amendment and its consequences before asking. Keep independent work moving. Editorial fixes, examples, decomposition details and local decisions within approved boundaries do not need another approval. Preserve the original approval reference and make any newer material decision explicit.

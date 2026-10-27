# Technical designs

## Storage selection

For Purpur local/GitHub work, the canonical design is `docs/techprojects/<slug>/<slug>.md`. Keep one source, source URLs, evidence, the reviewed revision and human decision, approved scope, decomposition and continuation state there. Use the content and validation guidance below. A TFS PBI is required only for an explicitly selected TFS assignment. In that route, use the PBI procedures below instead of duplicating the record locally.

For local handoff, use the document path and Git revision (or an identified saved snapshot before the first commit), and the direct user decision source in place of a PBI ID/revision. No issue or work-item closure is implicit. An approval record describes a real human decision and never creates one.

## TFS storage

The canonical technical design lives in `System.Description` of the scoped PBI `Исследование: …`, including designs shared by several repositories. Link the source Feature or PBI, Spike results and implementation items. Maintain it through [TFS writing](../../tfs-work-items/references/links-and-writing.md). Do not duplicate the canonical design in each repository.

Repository-owned API and component documentation stays with its code and links the common design where needed. Preserve existing imports in `docs/techprojects/<slug>/<slug>.md` and their optional `assets/` until a migration is requested. An explicit local-document request still uses that location. Preserve an imported kebab-case wiki slug and source URL. On layout-only moves preserve names and content and repair links.

## Content

Resolve consequential choices through [clarification](clarify-requirements.md) and [research](research.md). Follow [writing conventions](document-writing.md). Use this concise structure:

- `Кратко`: the goal and chosen solution in a short opening summary.
- `Интерфейс`: controls and visible behavior.
- `Архитектура`: the chosen solution's responsibilities, data sources and boundaries.
- `Сценарии`: user triggers, calls and observable results.
- `Контракты`: changed methods and data formats, with minimal examples.
- `Решения`: concise answers to questions resolved with the user during design review, with the reason for each choice.

Number headings under the repository conventions. Keep every section brief and add subsections only when needed. Define recurring domain terms once and use them without repeating their qualifications. Link detailed research evidence in Spike results. Leave checkout state, tool transcripts, review chronology, announcements and implementation checklists out of the design body. Describe implementation internals only when needed to assess a material decision or contract. Implementation progress belongs in the PR plan. Research continuation state belongs in the PBI.

- Start each scenario with its trigger and follow causal order through controls, actors, calls and results.
- Verify methods, routes, ownership and side effects against implementation or authoritative documentation. Label proposals and unverified claims.
- Keep contracts to required formats, invariants and minimal examples. State relevant failure, cancellation and asynchronous-update behavior briefly. Link unchanged contracts instead of copying schemas.
- Introduce entities, IDs, storage and API calls only for agreed scenarios. Existing adjacent controls or implementation capabilities do not expand the task's scope. Keep terminology at its owning source.

Preserve manual edits, deliberate omissions and source decisions in faithful imports. Keep editable visual sources.

Keep each detail in one owning section and reference it elsewhere. In `Решения`, record only agreed choices affecting behavior, architecture, contracts or scope, with brief reasons and relevant rejected alternatives, including scope exclusions. Preliminary comparisons remain research evidence. Editorial wording fixes do not create decision entries. When meaning changes, update the existing decision, affected design sections and Spike conclusions. Omit repository or file inventories unless they explain a material responsibility or boundary.

## Validate and deliver

Walk through the important scenarios and verify prerequisites, identifiers, ownership, recovery, links and examples. Substantive designs need an independent review, editorial changes need document checks. Report actual local and publication status and verification gaps.

## Human review and handoff

Before implementation decomposition, the human reviews the technical design. Record their actual explicit decision once in the research PBI handoff: research PBI ID, the WI revision containing the reviewed design, approving person and source of the decision, scope or conditions and unresolved limits. Implementation PBI and Task descriptions link to the design without repeating its reviewed revision. Do not infer approval from a WI state, agent review or silence. Approval of a no-go result does not permit implementation decomposition or product implementation.

After approval to proceed, decompose the approved design into one or more separate implementation PBIs, each with its own child Tasks, through [decomposition](../../tfs-work-items/references/decomposition.md). The research PBI remains the source of the design and conclusions. Keep the handoff in its description: source Feature or PBI, approved design reference and decision, affected repositories, links to implementation PBIs and their Tasks with dependencies and checks, next action and remaining risks or blockers. Link authoritative evidence. Do not rely on the first chat's transcript or temporary files for essential instructions. Store the reviewed revision before recording the approval, since approval and handoff updates advance the WI revision.

Finish the research chat after post-approval decomposition and handoff are complete. Implementation requires a separate user launch in another chat using an implementation PBI or Task. Its agent follows the link to the research PBI, reads the approved design and handoff, and verifies the current design against the approved content before starting or resuming dependent implementation. Metadata or handoff updates alone do not invalidate approval. If the approved content or decision cannot be recovered, obtain the missing evidence instead of assuming it.

Changes to requirements, chosen approach, shared contracts or material accepted risks need renewed human review of the changed part. Prepare the actual amendment and its consequences before asking. Keep independent work moving. Editorial fixes, examples, decomposition details and local decisions within approved boundaries do not need another approval. Preserve the original approval reference and make any newer material decision explicit.

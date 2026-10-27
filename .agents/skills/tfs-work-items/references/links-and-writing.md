# Links and writing

## Relations

- PRs link each scoped Task and its immediate PBI/Impediment/Bug parent. Bugs link their immediate PBI/Impediment parent. Stop before Features. Use [tfs-pull-requests](../../tfs-pull-requests/SKILL.md) and verify saved ArtifactLink relations, including links created from `#<id>` commit subjects on push.
- Feature fields, states and unrelated relations are read-only. The permitted relation changes are the scoped PBI hierarchy below during authorized Feature research and its approved implementation decomposition.
- `Hierarchy-Forward`: permitted parent source → scoped child target. Verify the parent type and [research/implementation PBI and Task structure](decomposition.md) before writing.
- `Dependency-Reverse` (Predecessor): source depends on target. `Dependency-Forward` (Successor): target depends on source. Add from the scoped Task and verify direction.
- `Related` is context, not a dependency.

## PBI hierarchy under a Feature

An authorized Feature research launch creates or reuses its dedicated research PBI as a Child of the source Feature. After design approval, attach each implementation PBI from its decomposition as another Child of the same Feature. Keep research and implementation Tasks under their respective PBIs. A source URL or `Related` link does not replace the hierarchy relation.

1. Read the source Feature, scoped PBI and their current relations before writing. Verify the source and item types and reuse a matching PBI when it belongs to this assignment.
2. If the PBI already has the source Feature as Parent, keep that relation. If it has another Parent, do not reparent it automatically. Resolve the conflict before dependent work.
3. For a new or parentless scoped PBI, add the hierarchy once through the supported integration: `Hierarchy-Forward` (Child) from the source Feature to the PBI, or the reciprocal `Hierarchy-Reverse` (Parent) from the PBI to the Feature. Do not write both directions separately or duplicate an existing relation. Re-read both targets immediately before a relation write and preserve all other fields and links.
4. Read back both items and verify that the Feature lists the PBI as Child and the PBI lists that Feature as Parent. Report the actual saved hierarchy. This exception does not authorize changes to Feature fields, states or unrelated links.

## Write discipline

Never create or edit WI comments or write `System.History`. Report progress in chat or the PR. Maintain research results in the PBI's authorized result sections. Read the target immediately before every write, change only required fields and read it back to verify the saved result. Use a revision guard only where the actual integration supports it. On conflict, re-read and reconcile with current content before retrying. Without atomic revision support, do not claim conflict protection.

Preserve human edits, deliberate omissions and unrelated fields. If a safe merge cannot be established, keep the current content and resolve the conflict before dependent work. Use concise HTML with escaped values and observable outcomes/checks. Link maintained docs and verified WIs. Do not @-mention people.

## Empty task descriptions

Missing values, whitespace and empty HTML formatting are empty. Text, placeholders, links, images or attachments are content. Preserve uncertain cases.

By default, fill only empty `System.Description`, including sibling QA Tasks. On conflict, re-read and write only if still empty. Preserve all other populated descriptions except the narrow maintained-result scope below.

## Maintained work results

Within an authorized assignment, nonempty descriptions may be updated only in its own research PBI for the canonical technical design, post-approval decomposition and handoff, and in its own scoped Spike Tasks for their question/evidence/conclusion. Ownership must follow the current assignment or an explicit human designation. A matching title, assignee or WI state alone is insufficient. All other descriptions, including implementation PBIs/Tasks and sibling QA plans, keep the empty-only rule.

Follow [research](../../design-and-docs/references/research.md) and [technical design](../../design-and-docs/references/technical-design.md) contracts instead of copying them here. Re-read the latest description, reconcile the intended result with manual changes and update only the relevant sections. Do not replace a populated description wholesale from a stale draft.

Record design approval only from a direct human decision, with its source, research PBI ID, reviewed revision and approved scope. Preserve that reviewed baseline and distinguish subsequent changes. A material design change follows the linked amendment flow before dependent decomposition or implementation. WI state, agent review and an agent-written approval label are not human approval. Keep pre-review findings in the research PBI. After design approval, record decomposition of the approved solution and handoff for the separate implementation chat.

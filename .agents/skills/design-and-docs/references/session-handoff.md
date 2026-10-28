# Session handoff

The canonical department task in `tasks/<id>/README.md` owns authorization, accepted decisions, plan, results and the next step under [repository-tasks](../../repository-tasks/SKILL.md). The linked technical design owns lasting behavior and contracts. A handoff makes those records usable by the next receiver without creating another plan or activity log.

## Save

For unfinished work that is paused, transferred or losing context, update the task with completed and open plan items, valid checks and gaps, blockers, decisions and the next action. Preserve direct authorization and its limits. Identify workspace, branch/SHA or unborn branch, dirty/new scope and any active assignments needed for safe continuation. Reference the current design and evidence instead of copying them.

For research, preserve the question, findings, source evidence and [implementation handoff](technical-design.md#human-review-and-handoff) in the task. Store lasting design in `docs/techprojects/<slug>/<slug>.md` and link it. Useful sanitized durable evidence may live in `tasks/<id>/artifacts/`. Keep raw run logs, caches, review bundles and temporary screenshots outside tracked sources.

Give a concise chat handoff with the task path, actual state and next action. A PR links to the task plan. A PR without a separate department task keeps its checklist and may use a chat handoff for continuation details. Small local work without a task may use a chat handoff. Do not create an empty PR or a separate plan file to save progress.

Before expected context compaction, preserve essential decisions and continuation state at their owner. Keep bulky investigation in bounded assignments under [context boundaries](../../dev-cycle/references/parallel-work.md#context-and-tool-boundaries). Saving progress does not expand commit, push or publication authority. Status-only or completed work needs no additional handoff record.

## Resume

Read the task, its authorization, acceptance, open plan items, evidence and linked design. Reuse settled decisions and existing authority. Research and implementation launch separately. Resume unfinished research within the request, or follow the implementation request and accepted design without asking for the same permission again. Do not restart research solely because the agent or chat changed.

Verify ownership through [task worktree](../../dev-cycle/references/task-worktree.md) and reconcile the recorded branch, source identity, dirty/new files and checks with the actual workspace. Locate missing in-flight changes before editing. Review the PR when one exists and verify uncertain external outcomes before retrying them. Continue from the first open item within current authorization.

Check that the current design still matches the accepted content before dependent implementation. Metadata, handoff or editorial updates alone do not invalidate a decision. If material content changed, prepare the amendment for the responsible human decision while continuing independent work. Missing decision evidence remains a gap instead of an assumed approval.

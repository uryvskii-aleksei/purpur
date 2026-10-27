# Session handoff

## Local and GitHub handoff

For local research, preserve the question, conclusions, design approval, source evidence, decomposition and next action in the canonical `docs/techprojects/<slug>/<slug>.md`. No TFS access is required. For other local work, give a concise chat handoff with workspace, branch/SHA or unborn branch, dirty files, completed work, next action, blockers and valid checks. Commit or push only within the existing authorization. A PR keeps its checklist, not the operational transcript.

On resume, reconcile the handoff with the actual workspace and current design. Verify uncertain external outcomes before retrying. Do not restart settled research or infer approval from an agent's notes. The TFS-specific instructions below apply only to an explicit TFS assignment. Shared chat and PR handoff guidance remains applicable.

## Save

For research without a PR, maintain the current question, evidence, decisions, open work and next action in the research PBI. Before the research chat ends, preserve the [design approval and implementation handoff](technical-design.md#human-review-and-handoff) there. No repository plan file or empty PR is needed.

For unfinished work that is paused, transferred or losing context, write a concise handoff in chat with the date, workspace and coordinator, branch/SHA, dirty files, completed work, next step, blockers and questions, valid checks and active workers. Keep the PR [plan section](plan-format.md#plan-section) limited to its checklist and update the affected items. Do not add handoff paragraphs or operational metadata to the PR description.

Before expected context compaction, preserve settled decisions and continuation state in the latest chat handoff. Research decisions and handoffs remain in the research PBI. Keep bulky investigation in bounded assignments under [context boundaries](../../dev-cycle/references/parallel-work.md#context-and-tool-boundaries), with concise results returned to the coordinator.

Commit uncommitted work within the task's authorization and push when the PR exists. Report the PR, commit and next step. For other work without a PR, give a short handoff in chat and create no plan file. Status-only or completed work needs no session handoff. A completed research launch still needs its durable implementation handoff.

## Resume

When given a research PBI, read its design, evidence, decomposition and handoff. Continue unfinished research within the request. A new implementation request in another chat targets an implementation PBI or Task and follows its link to the research PBI to verify the [human-approved design](technical-design.md#human-review-and-handoff). Do not reconstruct settled research from the old chat or restart it solely because the agent changed.

Find the PR by branch (`list_pull_requests` on `sourceRefName`) or through the WI relation and read the `## План` checklist and its open items. Read the latest chat handoff and the linked research PBI when present. Verify workspace ownership through [task worktree](../../dev-cycle/references/task-worktree.md) and reconcile branch, status and evidence with the actual tree. Verify pending external operations before retrying them. Continue from the first open item within the current request.

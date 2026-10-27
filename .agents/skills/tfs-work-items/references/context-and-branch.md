# Context and branch

## Read context

Read the WI with relations and comments. Capture type, state, owner, description/AC, project/area and parent. Expand to parents and siblings only for scope, dependencies, decomposition or QA. Reading comments does not authorize writing them.

For research, locate the `Исследование: …` PBI, its canonical design in `System.Description`, relevant `Spike: …` Tasks and accumulated evidence under [research](../../design-and-docs/references/research.md).

After research, the separate implementation launch targets a different implementation PBI or one of its Tasks. Follow its reference to the canonical research PBI. Verify the direct human design decision source, research PBI ID and reviewed revision, [decomposition into separate implementation PBIs and their Tasks](decomposition.md) derived from that approved design, and handoff. State or agent conclusions are not approval. If the design changed materially after that revision, resolve human review before dependent decomposition or implementation.

For implementation or resumption, also locate the source branch's PR with its `## План` section when one exists. Summarize constraints and blockers, reusing unchanged context.

## Start a branch

Research and Spike work without repository changes needs no branch or worktree. Start the repository workflow only when the request authorizes repository changes. After design approval, complete decomposition and save the handoff before ending the research chat. It does not start implementation there.

Use the [task worktree](../../dev-cycle/references/task-worktree.md) and [branch naming](../../../../AGENTS.md#tooling-git-and-dependencies).

Before new work, and every time the primary checkout switches to `main`, fetch and run `git pull --ff-only` on that branch. Do not check out the previously stored local tip. Create the task branch from the updated `origin/main`. Create a new worktree from `origin/main` after the same fetch, not from another checkout's HEAD and not from a stale local `main`. Use another base only when the user explicitly names it, then pull that branch the same way and create the worktree from it. Do not reset, stash or discard local changes to reach the base. If the pull cannot fast-forward, report it and stop. Continuing an owned task branch does not move it back to the base.

An explicitly requested historical republication uses the verified historical base under [historical release lines](../../tfs-pull-requests/references/version-guard.md#historical-release-lines). This is the exception to the latest-base base rule. Resolve the task's semantic boundary from history and release evidence before creating its release branch.

Fetch when available and create or attach the branch in the owned workspace. Report WI, workspace path and branch/base. A branch-only request ends there.

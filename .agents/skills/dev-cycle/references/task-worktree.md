# Task worktree

One independent dialog owns one branch and one workspace with one coordinator. Use the primary checkout. Create a linked worktree only when another agent is already working there in a parallel chat. Apply this before repository writes, including documentation. Read-only investigation needs no new workspace.

## Select before writing

1. Inspect the absolute root, branch, HEAD, status and `git worktree list --porcelain`. An unborn `main` has no HEAD or merge base: bootstrap it in the primary checkout without creating an empty commit or linked worktree. The primary checkout is the main working tree, not a path under `.worktrees/`. Establish ownership from this dialog or an explicit handoff. Unresolved ownership blocks writes.
2. Continue an owned task in its existing workspace, including a primary-checkout task, and preserve the exact PR source branch.
3. For a new task, select the configured base from [AGENTS.md](../../../../AGENTS.md#tooling-git-and-dependencies). Use [TFS context](../../tfs-work-items/references/context-and-branch.md) only for a TFS assignment. The default base is the latest configured remote base (`origin/main` for Purpur). An explicitly requested historical republication uses its verified historical base through the same reference. Fetch when available, otherwise work on the known local base with freshness reported as unknown and verify the target before publication.
4. Use the primary checkout when it is free: it is clean and is on main, on the explicitly named base, or already on this task's branch. On a free main checkout, `git pull --ff-only` before creating or attaching the task branch. The primary checkout is occupied when it is on another task branch, has uncommitted changes, or this dialog does not own it. Only then create `<primary-checkout>/.worktrees/<task-name>` from the base selected in step 3, after the fetch/pull required for that base.
5. Before creating that worktree, run a local preflight only: refresh `git worktree list --porcelain`, confirm the absolute path is unique and does not exist, and confirm the branch is not checked out elsewhere. Do not read TFS or remove worktrees here. Create with a runtime tool that supports that destination and the selected base, otherwise `git worktree add <path> <base>`. Keep `/.worktrees/` ignored. Verify path, branch and HEAD.

Never force a checkout, or relocate, stash, reset or auto-commit existing changes to free the primary checkout. Without worktree support, agree on a single-writer alternative.

## Work and deliver

All commands and worker assignments use the selected root. Recheck ownership, branch and status before staging and publication. Prepare dependencies and ignored configuration there, preserving secrets and local changes. Coordinate shared refs and contracts and use separate ports for concurrent apps.

On resume, verify the recorded workspace against the actual tree before editing and locate missing in-flight changes first. A linked worktree is already on its task branch: continue there and do not check out `main` inside it. If the task used the primary checkout and that checkout is free on `main`, check out the task branch and continue. If another dialog now occupies the primary checkout, do not switch it. PR publication does not end ownership or authorize removal.

## Return the primary checkout

After the PR is published, commit and push the task changes first. The primary checkout must be clean. If this dialog used the primary checkout, check out `main` and `git pull --ff-only` so it matches current `origin/main`. Do not switch while uncommitted changes remain, and do not switch a primary checkout that this dialog did not use. A linked worktree stays on the task branch.

## Cleanup on request

Clean up worktrees only on an explicit request such as «почисти worktree». Creation never triggers it. Inspect each registered linked worktree individually:

1. Resolve the owning WI from branch or PR and read its live completion evidence in the correct host/project. For TFS, only the verified completion state of its actual process qualifies. For GitHub, verify the owning task/PR completion through its host. Skip unknown ownership, state, unavailable integrations and orphan/detached entries. Never close a WI for cleanup.
2. Exclude the primary/current, locked, pinned, shared or actively used workspace. Confirm coordination has ended.
3. Inspect staged, unstaged, untracked and needed ignored data plus unpublished commits. Removal requires a clean checkout, published commits and no needed local-only data. Skip uncertain or unsaved state.
4. Immediately before removal recheck WI state, identity and the exact absolute path against the inventory. Use a recoverable runtime archive for an eligible managed attachment, otherwise `git worktree remove <absolute-path>`, on Windows `git -c core.longpaths=true worktree remove`. Never use force, recursive deletion, broad prune or shared Git configuration changes. Remove a missing-path registration only after the same checks. Preserve branches, PRs and tasks.
5. Verify the path and registration are gone. Report removed and skipped candidates. An ineligible candidate stays registered.

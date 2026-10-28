# Create a local commit

Verify root, branch, status, staged and unstaged diff and recent history. Select only task files. Exclude unrelated edits, raw run artifacts, personal settings and secrets. Preserve clean durable evidence deliberately owned by the task. Do not create an empty commit solely to track a plan. Bootstrap an empty repository with real scoped files under [plan start](../../design-and-docs/references/plan-format.md#start).

Commit only when requested or included in the authorized delivery scope. A commit-only request excludes push and PR creation. Keep the canonical task plan and results consistent with the files being committed.

## Message and commit

Write the subject in Russian, in the imperative, at most 72 characters and without a final full stop. Include the repository task ID when one exists. Add a body only for a useful explanation. Use `git commit --file` for multiline bodies.

Stage explicit paths, inspect the staged diff and commit. Never bypass hooks unless explicitly requested. Report SHA, subject, branch and publication status.

## Amend

Never amend pushed or shared commits. Amend an unpublished commit only on explicit request or when a hook modified files for the just-created, unpushed commit. Otherwise create another commit.

# Create a local commit

Verify root, branch, status, staged and unstaged diff and recent history. Select only task files. Exclude unrelated edits, artifacts, personal settings and secrets. Do not create an empty commit solely to track a plan. Bootstrap an empty repository with real scoped files under [plan start](../../design-and-docs/references/plan-format.md#start).

## Message and commit

Subject: imperative, at most 72 characters, no final full stop, with `#<WI-id>` when known. Add a body only for a useful explanation. Use `git commit --file` for multiline bodies.

Stage explicit paths, inspect the staged diff and commit. Never bypass hooks unless explicitly requested. Report SHA, subject, branch and publication status.

## Amend

Never amend pushed or shared commits. Amend an unpublished commit only on explicit request or when a hook modified files for the just-created, unpushed commit. Otherwise create another commit.

---
name: tfs-pull-requests
description: >-
  Create local Git commits or create/update TFS pull requests and address their review comments. GitHub PR delivery uses dev-cycle.
  Use for закоммить, commit, create PR, обнови описание PR,
  обработай комментарии PR, address PR comments. A commit-only request excludes push.
---

# Git commits and TFS pull requests

| Request | Reference |
| --- | --- |
| Local commit | [Commit](references/commit.md) |
| Publish or create a PR | [Create](references/create.md) |
| Refresh a PR description after a push | [Refresh](references/refresh.md) |
| Fix or reply to review comments | [Review comments](references/review-comments.md) |

Use this skill only for an explicitly selected TFS assignment. Resolve the server, project and repository from the supplied URL and live integration. GitHub delivery follows [dev-cycle](../dev-cycle/SKILL.md). Local commits are provider-independent.

## Publication boundary

PR creation includes scoped commits, push and WI links. An authorized PR delivery includes scoped commits, push and a draft PR under [plan start](../design-and-docs/references/plan-format.md#start). Planning alone does not authorize publication. Research or decomposition without repository changes requires no PR. A review round includes fixes, checks, one commit/push and replies. A description-only refresh changes text only. Merge or completion, policy bypass and thread resolution require explicit authorization naming the PR.

Verify the exact PR, repository and payload before writes, and the owned worktree and source branch before local fixes.

## Delivery checks

Run checks and review through [build-and-test](../build-and-test/SKILL.md) and [dev-cycle](../dev-cycle/SKILL.md). Before delivery apply the [app version guard](references/version-guard.md), keep the PR `## План` section current under [plan progress](../design-and-docs/references/plan-format.md#progress), inspect the full branch diff, follow the [text format](references/create.md#text-format) and verify [WI relations](../tfs-work-items/references/links-and-writing.md#relations). Report actual publication, review and CI status.

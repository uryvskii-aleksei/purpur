# Refresh an open PR

After each push, fetch the target and inspect the whole merge-base-to-HEAD diff. Record the checked SHA. Update the `## План` checklist items under [plan progress](../../design-and-docs/references/plan-format.md#progress). Refresh `## Цель` under [text format](create.md#text-format) only when stale or explicitly requested. Keep exactly these two sections and no prose around the plan checklist. A text-only refresh needs neither code edits nor plan items.

Thread replies belong to [review comments](review-comments.md). Report current [CI evidence](../../build-and-test/references/ci-evidence.md), publication and remaining work.

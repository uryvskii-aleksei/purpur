# Lint and formatting

Run the affected workspace lint script when defined. For a focused fix, the file owner uses the configured local linter on the affected paths: the assigned worker, or the coordinator within the [direct-authoring criteria](../../dev-cycle/references/parallel-work.md#delegation-threshold). Inspect the diff and rerun applicable lint.

Fix code without weakening rules or editing `the shared lint configuration` to pass. `eslint-disable` needs explicit user authorization and a reason. Finish with zero errors and no new warnings.

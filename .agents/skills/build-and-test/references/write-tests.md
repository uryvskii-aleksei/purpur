# Write behavior tests

Test observable contracts, relevant edge cases and regressions. Reuse fixtures and explicit expected values. Do not mirror implementation or cover only low-impact text edits.

For stateful/async changes, verify the affected transition across completion, state application, readiness or cancellation. Check whether helpers execute that behavior or merely record/mock it. Inspect coverage scope before citing a percentage.

New TypeScript tests use `*.spec.ts(x)` beside the module. Keep existing runners/layouts. Use the existing test runner (Node.js for the current site and harness) and browser tooling where configured. Public UI components follow [story conventions](browser-smoke.md#story-conventions).

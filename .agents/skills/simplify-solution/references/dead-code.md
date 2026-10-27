# Remove dead code

Prove unused code with lint and reference searches. Check exports, dynamic references and documented external consumers. A missing in-repo import alone does not prove a public export dead.

Remove only proven unused code in scope. A public-contract change needs existing authorization or clarification. Verify through [build-and-test](../../build-and-test/SKILL.md).

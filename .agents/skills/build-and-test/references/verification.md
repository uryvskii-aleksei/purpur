# Select and execute checks

Run from the selected worktree root. Take scripts and workspace names from [project commands](../../../../README.md#1-быстрый-старт), owning documentation and actual manifests.

- Build-only/test-only/lint-only requests run that mode. Running tests does not request new tests.
- Changed code needs applicable lint and behavior tests. Build when compilation, exports or packaging change. Rendered UI/stories need [browser smoke](browser-smoke.md). Prose-only work needs document checks.
- Confirm actual manifest/lockfile resolution before consumer tests. Registry dependencies may omit neighboring source edits. Inspect the actual package-manager configuration. Build local dependencies first when required.
- Confirm command completion and its result. Fix in-scope failures and repeat affected checks after edits or integration. Unavailable scripts or prerequisites stay unverified.
- Mocks verify client behavior. When compatibility is in scope, test affected backend, device or external-service boundaries separately.

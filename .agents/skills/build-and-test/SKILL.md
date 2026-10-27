---
name: build-and-test
description: >-
  Build, test and diagnose affected workspaces. Verify, lint, run/write behavior tests,
  and investigate browser console, network and HAR data.
  Triggers: собери, собери пакет, build, build a package, build gate, проверь, проверь решение, verify,
  after feature, на ошибках сборки или тестов, запусти тесты, run tests, наведи порядок, eslint,
  lint, fix lint, покрой тестами, напиши тесты, add tests, запусти storybook, sb, смотри консоль, проверь запросы, analyze logs, analyze HAR, check network.
---

# Build and test

Choose the requested operation. Read only its reference:

| Request | Reference |
| --- | --- |
| Build, run tests, verify changes or diagnose failed checks | [Verification](references/verification.md) |
| Lint/format | [Lint](references/lint.md) |
| Add behavior tests | [Write tests](references/write-tests.md) |
| Storybook/UI smoke | [Browser smoke](references/browser-smoke.md) |
| Console/network/HAR diagnosis | [Browser diagnostics](references/analyze-logs.md) |
| PR readiness/CI status | [CI evidence](references/ci-evidence.md) |

Run applicable checks from actual manifests and reuse evidence that still covers the integrated state.

---
name: quality-assurance
description: >-
  Prepare and execute independent acceptance, exploratory, integration and regression checks for a specific build and allowed environment. Use for QA plans, behavior testing and defect verification, not code review alone.
---

# Quality assurance

Use the [qa contract](../../roles/qa.md). [build-and-test](../build-and-test/SKILL.md) owns executable commands and evidence.

1. Identify acceptance, exact source/build, environment, integrations and permitted side effects. Another build's report is not current evidence.
2. Select scenarios by changed behavior and risk. Cover relevant transitions, permissions, duplicates, unavailable data, failures, retries/cancellation and recovery. In the shop, distinguish cart/email preparation from accepted or paid orders.
3. Prepare separate test data. Execute permitted local tests or author assigned tests. Live external checks go through coordinator within authorization. A browser/API check changing production records is not a read.
4. Record important scenarios as passed, failed, blocked or not run, with identity, inputs and evidence. Expected results come from requirements/contracts, not implementation output. Mocks verify their own boundary only.
5. Return defects with reproduction, expected/actual behavior, impact and evidence. The responsible author fixes implementation. Recheck affected paths after integration and report owned test-data cleanup.

QA readiness advice does not grant release or business acceptance. Same-author checks are not independent QA. Code/design analysis stays with [reviewer](../../roles/reviewer.md).

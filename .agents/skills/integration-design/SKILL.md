---
name: integration-design
description: >-
  Design, implement and verify scoped API/data mappings, synchronization and recovery between actual systems. Use for catalog, orders, CRM, accounting or production integrations, not unrequested platform selection.
---

# Integration contracts and implementation

Use the [integration-engineer contract](../../roles/integration-engineer.md), [architecture](../architecture/SKILL.md) for shared decisions and [build-and-test](../build-and-test/SKILL.md) for checks.

1. Identify systems, owners, environments and supported APIs/schemas from evidence. Use configured secret mechanisms, never repository credentials. Without live access, a labelled proposal/mock adapter may still be useful.
2. Define authoritative source/identifiers per entity/field, direction, freshness and conflict ownership. Map units, precision, statuses, optional values and deletion where relevant.
3. Trace success and partial failure. Specify relevant idempotency/deduplication, timeout, retry/backoff, ordering, cancellation, reconciliation, replay and observability. Do not blindly retry non-idempotent writes.
4. Align public contracts with architect, caller behavior with coder, operational signals with DevOps and acceptance/recovery with QA. Assign shared-schema ownership before concurrent edits.
5. Implement assigned adapters/contracts and test their boundaries. Distinguish mocks, contract tests and live compatibility. Coordinator performs live writes, replay, migration and data repair only within explicit task scope.

Return mapping/contract or adapter, evidence, compatibility/recovery and operational prerequisites. A system is not authoritative merely because it is easy to access.

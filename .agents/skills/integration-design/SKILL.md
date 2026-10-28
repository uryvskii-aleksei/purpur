---
name: integration-design
description: >-
  Design, implement and verify scoped API/data mappings, synchronization and recovery between actual systems. Use for catalog, orders, CRM, accounting or production integrations, not unrequested platform selection.
---

# Integration contracts and implementation

Use the [integration-engineer contract](../../roles/integration-engineer.md), [architecture](../architecture/SKILL.md) for shared decisions and [build-and-test](../build-and-test/SKILL.md) for checks.

1. Identify actual systems, owners, environments and supported API/schema versions. Trace one real business operation across them. Separate the current process from proposed automation. Without access, a labelled mapping or mock can answer a bounded question without claiming live compatibility.
2. Map semantics before fields. Establish identifier namespace/lifecycle, authoritative source per entity/field, direction, units/precision, currency/time zone, null versus unknown, deletion and state transitions. Record freshness and conflict rules. For example, an accepted request, a paid order and a shipment cannot share one undifferentiated success flag.
3. Classify each operation as a read or an effect with a known repeatability contract. Identify where the effect commits and the scope/lifetime of any idempotency key. Bind a repeated key to the same operation/payload or define a conflict. A local deduplication record cannot prevent a remote duplicate after its own state is lost.
4. Define failure behavior at that boundary. A timeout may mean no execution, partial execution or a committed result whose response was lost. Specify the available status lookup/readback, bounded retry/backoff and a stopping point for unknown results. Preserve operation identity across retries. Reconcile before repeating an effect that the receiver cannot deduplicate.
5. For event/synchronization flows, account for duplicate/out-of-order delivery, versions, cancellation and partial progress where applicable. Define how to detect a missed/divergent record and repair or replay it without overwriting a newer authoritative value. Choose a durable progress mechanism supported by the actual platform rather than inventing a queue/service.
6. Align interfaces with architect, caller states with coder and operational signals with DevOps. Verify meaningful boundaries through [build-and-test](../build-and-test/SKILL.md): semantic edge cases, duplicate delivery, a lost response after commit, partial success and reconciliation as relevant. Use provider contract/sandbox evidence separately from mocks. Live replay, migration and repair remain coordinator operations within task scope.

Return the usable mapping/adapter with its effect boundary, recovery path and compatibility limits. Keep diagnostics sufficient to locate an operation without exposing customer content or credentials. If the provider cannot establish an outcome safely, report that specific unresolved operation instead of declaring every timeout failed or success guaranteed.

For customer identity, order access, payments or personal data, apply [commerce security and data lifecycle](../architecture/references/commerce-security.md) to the affected boundaries.

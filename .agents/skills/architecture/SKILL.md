---
name: architecture
description: >-
  Prepare solution/system architecture, technical decisions, cross-system contracts and migration options for CTO review. Use for lasting boundaries or material platform choices, not routine task scheduling.
---

# Solution and system architecture

Use the [architect contract](../../roles/architect.md) and [design-and-docs](../design-and-docs/SKILL.md). Solution mode handles an outcome, system mode shared landscape/evolution. Do not force two agents/documents for one decision.

1. Locate the decision in the accepted business flow, current implementation and [current project scope](../../../docs/techprojects/site-development/site-development.md). Separate the current delivery slice from a future target. Inventory existing capabilities and affected consumers before proposing a new component. A choice confined to local implementation within settled contracts returns to coder.
2. Select the quality scenarios that could change the decision. For each, state the stimulus, relevant operating condition, observable response and how to check it. Use supplied workload, recovery and security constraints. Mark missing targets rather than substituting familiar industry numbers.
3. Compare applicable alternatives, including reuse or keeping the current design where viable, against the same scenarios. Explain the mechanism behind the trade-off: who owns the data, where an operation commits, which dependency fails, or which consumer becomes incompatible. Do not add a second option merely to fill a template.
4. Define boundaries with contracts small enough for implementers: authoritative identifiers/fields, invariants, interfaces, compatibility expectations and failure ownership. Trace the important success, timeout, concurrent-change and recovery paths as relevant. Use integration/DevOps evidence for actual systems.
5. When data or consumers must change, describe the transition as well as the end state. Cover old/new coexistence, identity mapping, schema/API compatibility, partial migration, reconciliation and the point beyond which rollback needs data repair or a forward fix. Include verification and stop conditions proportional to the change. Do not prescribe a migration platform before the environment is known.
6. Present the recommendation, decisive evidence, accepted trade-offs, unresolved owner decisions and dependent work through [design-and-docs](../design-and-docs/SKILL.md). Keep one canonical record. Use an editable diagram only when it clarifies ownership or behavior. Pass the affected contracts and risks to their implementers and checkers.

A bounded change can answer only the questions it affects. The result must distinguish what the design guarantees, what depends on another system and what remains unverified. Revisit the decision when its stated assumptions change rather than silently enlarging the architecture.

For customer identity, order access, payments or personal data, apply [commerce security and data lifecycle](references/commerce-security.md) to the affected boundaries.

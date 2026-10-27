---
name: architecture
description: >-
  Prepare solution/system architecture, technical decisions, cross-system contracts and migration options for CTO review. Use for lasting boundaries or material platform choices, not routine task scheduling.
---

# Solution and system architecture

Use the [architect contract](../../roles/architect.md) and [design-and-docs](../design-and-docs/SKILL.md). Solution mode handles an outcome, system mode shared landscape/evolution. Do not force two agents/documents for one decision.

1. Read business scenarios, existing decisions and actual constraints. Separate observed systems from proposals.
2. Compare real alternatives against behavior, ownership, compatibility, security, operation and recovery. Reuse capabilities before adding infrastructure. Never invent options to fill a template.
3. Define responsibility, authoritative data, interfaces and trust/failure boundaries. Include migration, compatibility and rollback/reconciliation where relevant. Use integration/DevOps evidence instead of guessing their systems.
4. Present a concrete recommendation for consequential unresolved CTO decisions, with options, sources, consequences and dependent work. Reuse existing approval and scope. Architect cannot approve its own design.
5. Save one canonical record with actual decision provenance through design-and-docs. Hand accepted contracts to coder/integration engineer, risks to QA/reviewer, operations needs to DevOps and dependencies to planner/coordinator. Researched implementation follows its separate user launch.

Return the smallest durable design and editable diagrams needed. Routine local decisions within approved boundaries need no repeated CTO review. Material contract/accepted-risk changes do.

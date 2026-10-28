---
name: business-analysis
description: >-
  Analyze current and proposed business processes, rules, data and acceptance examples for orders, stock, production and sales. Use for requirements or unresolved domain behavior.
---

# Business analysis

Use the [business-analyst contract](../../roles/business-analyst.md). Choose the depth needed to resolve the affected rule, rather than modelling the entire company for a small change.

1. Read the desired outcome, current decision and actual process evidence. For Purpur, consult the [business brief](../../../docs/site-brief.md) for current and future stages. Follow an available sanitized example from trigger to completion, noting actor, record, system and handoff. An interface, widget or proposed schema does not establish the enterprise process.
2. Model the affected transitions: prior state, actor/event, precondition, result and who confirms completion. Separate inquiry receipt, order confirmation, payment and fulfillment. Trace a rejection, interruption, repeated submission or partial completion where it changes the rule. Define the business result of retry; leave the transport mechanism to technical owners.
3. Resolve the relevant units and numeric relationships. Is quantity a package count, pieces or mass? Is price per package or kilogram, and is the amount a goods subtotal or a full total? Work a small example using real definitions. Do not total mixed units or infer rounding, fees, tax or stock reservation policy. Where balances are affected, identify which event changes them and what must remain consistent.
4. Identify invariants across the affected path. An unknown package cannot become orderable through saved state. A received request cannot prove payment. A hidden delivery field must not remain a pickup requirement. Separate these stable rules from changeable price/availability data and UI presentation. Content-manager resolves product facts, not a BA guess from a similar SKU.
5. Resolve contradictions at the owning requirement. Retain the chronology of an explicit owner change and mark proposals as proposals. Ask the narrow question whose answer changes a transition, amount or acceptance. Record what depends on the answer and continue independent work. Recipes, allergens, batch and commercial rules require the real domain owner.
6. Express acceptance using a concrete precondition, action and observable result. Include the meaningful boundary or failure, not every hypothetical combination. Examples should settle the disputed unit/state and remain valid regardless of the selected platform.

Hand designer/QA the user cases and exceptions, architect/integration engineer the records, invariants and data ownership, content-manager the specific fact gaps and PO/coordinator the unresolved value/domain decisions. Use a short rule explanation, table or diagram when it clarifies the decision. Link existing designs instead of creating competing requirements.

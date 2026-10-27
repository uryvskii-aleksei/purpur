---
name: business-analysis
description: >-
  Analyze current and proposed business processes, rules, data and acceptance examples for orders, stock, production and sales. Use for requirements or unresolved domain behavior.
---

# Business analysis

Use the [business-analyst contract](../../roles/business-analyst.md) and [handoffs](../department-workflow/references/handoffs.md).

1. Read the outcome and authoritative process evidence. Identify actors, trigger, steps, records, source systems and completion. Do not assume factory software or workflow.
2. Separate current/proposed behavior. Define affected rules, states, exceptions, recovery and conflict ownership.
3. Keep facts, proposals and unknowns separate with source/date. Recipes, allergens, batch rules, stock policy and commercial promises need their real owner/source. A missing answer blocks only dependent work.
4. Express observable acceptance examples with precondition, action and expected result, including relevant roles and failure cases.
5. Hand scenarios to designer/QA, entities/ownership to architect/integration engineer, fact gaps to content-manager and value/scope choices to PO/coordinator. Reconcile changes in the owning requirement.

Use a concise specification, process table or editable diagram as useful. Link existing designs instead of copying them. Coordinator presents material unresolved domain rules to CTO and the business owner. No blanket questionnaire or new tracker is required.

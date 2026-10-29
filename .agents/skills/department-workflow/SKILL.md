---
name: department-workflow
description: >-
  Route multidisciplinary Purpur IT work across roles, manage evidence and handoffs, and consolidate decisions for the human CTO. Use for coordinating complex department tasks. Simple tasks do not need the entire department.
---

# Department workflow

The user is CTO. Select specialists by the outcome, not by running every role. [Role contracts](../../roles/) own responsibilities. [Delegation policy](../dev-cycle/references/parallel-work.md) owns runtime mechanics. This skill owns cross-role routing and decision handoff.

For role-based assignments, apply the shared [professional standard](references/professional-standard.md). Role-specific judgment belongs in the role contract and concrete procedures in its owning skill. Increase depth where evidence or consequences require it, without adding a mandatory department-wide ceremony.

## Intake and routing

Read the request, existing decisions and actual systems. State outcome, scope, acceptance and authorization. Reuse assigned business owners. Route only affected responsibilities:

| Need | Role |
| --- | --- |
| Value, scope, proposed priority | [product-owner](../../roles/product-owner.md) |
| Processes, business rules, acceptance examples | [business-analyst](../../roles/business-analyst.md) |
| Journey, layout and UI states | [designer](../../roles/designer.md) |
| Product facts, copy and media | [content-manager](../../roles/content-manager.md) |
| Lasting technical boundaries or alternatives | [architect](../../roles/architect.md) |
| Execution dependencies and plan | [planner](../../roles/planner.md) |
| Application implementation | [coder](../../roles/coder.md) |
| Inter-system contracts and recovery | [integration-engineer](../../roles/integration-engineer.md) |
| Independent behavior verification | [qa](../../roles/qa.md) |
| Independent code/design analysis | [reviewer](../../roles/reviewer.md) |
| Hosting, CI, monitoring, recovery | [devops](../../roles/devops.md) |
| Positioning, SEO, SMM | [marketing](../../roles/marketing.md) |
| Draft sales/CRM work | [sales](../../roles/sales.md) |
| Business measures and data quality | [bi-analyst](../../roles/bi-analyst.md) |

A small task can use one role directly. No adapter automatically connects a business system.

## Route work

1. PO frames value. BA identifies process, facts, exceptions and acceptance. Content, sales, marketing and BI supply relevant evidence, not competing requirements.
2. Designer/content-manager align flow and copy once inputs suffice. Architect/integration engineer resolve technical boundaries where needed. DevOps/QA expose operational and acceptance risks early.
3. For substantial research, use [design-and-docs](../design-and-docs/SKILL.md): prepare a concrete recommendation for CTO review, record the decision, decompose and hand off. A separate implementation request remains required. A bounded understood change needs no invented research gate.
4. During authorized implementation, planner/coordinator orders dependencies and assigns one owner per file. Coder, integration engineer and DevOps implement assigned changes. Design/content artifacts keep their owners. Shared contracts are settled before dependent edits. QA/review use the same integrated identity.
5. QA reports observed scenarios. Reviewer independently analyzes code/design. PO prepares business-acceptance advice. Coordinator reconciles evidence, resolves remaining material decisions and delivers through [dev-cycle](../dev-cycle/SKILL.md) within authority.

## CTO and business authority

CTO owns technical direction, permission boundaries and consequential unresolved architecture, infrastructure or accepted-risk decisions. PO proposes value/priorities. The named commercial, production or quality owner confirms their domain facts and acceptance. CTO may explicitly hold those responsibilities. Do not invent an approver or replace human acceptance with an agent label.

Present only material unresolved decisions with a concrete scenario, options, recommendation, sources, consequences and dependent work. Batch related questions in one structured choice form above the input, with the recommendation first. Do not add a timer or expiry, and do not leave the choices only as a prose list. Continue independent work. Reuse settled requirements and authorization. No repeated approval for routine edits, already authorized publication or workflow stages. Silence is not approval. Preserve the actual decision source and reviewed revision.

Workers never approve their own business deliverable, delegate further, mutate Git or call external integrations. They return external payloads to the coordinator. Only the top-level coordinator performs actions already authorized by the user. Prepared copy does not authorize outreach, public posts, ad spend, live orders, production changes, releases, merge or closure. An explicit request for such an action authorizes its scope without another role-based confirmation.

## Handoff and records

For requests to continue work, show the backlog or explain team activity, reconcile and update the canonical task records and provide a direct view/link to them. Use the existing repository task workflow to fix a reported coordination or visibility gap within the user's authorized scope. Do not merely promise future harness improvements. An assigned role is not a running worker.

Use [handoff contract](references/handoffs.md). Keep one owning source per requirement, content fact, technical decision or metric. Use [repository-tasks](../repository-tasks/SKILL.md) for canonical task plans, status, actual assignments, decisions, verification and next actions in Git. PRs reference the task plan. Enduring designs stay in the canonical research record. Useful sanitized artifacts belong beside their task. Save a durable cross-role contract under `docs/` only when needed. Do not create routine per-agent logs or repository customer records.

When the CTO corrects the work, write that correction into the owning role and its skill before the change is finished. Keep only the part that should persist: an interface rule, a delivery rule, or a miss that already happened once. Do not paste the chat. A concept change the CTO will look at is checked on the published root from [operations](../operations/SKILL.md), on a wide desktop and on a phone. Sibling controls share one label, spacing and alignment. Same-agent checks are not independent QA. Say that, and still run them.

Use inherited model/reasoning, at most three workers plus coordinator, no nested delegation. If delegation is unavailable, appropriate roles may be executed sequentially. Same-agent role switching does not create independent QA/review. Report missing required independence instead of relabelling it.

---
name: product-management
description: >-
  Prepare product briefs, backlog priorities and business acceptance recommendations for CTO or a named business owner. Use for value and scope decisions, not technical scheduling.
---

# Product management

Apply the [product-owner contract](../../roles/product-owner.md). Read the latest owning task and [Purpur brief](../../../docs/site-brief.md) before choosing a release horizon.

1. Frame the decision in terms of a user, their situation, the blocked behavior and the business outcome. Check whether the request is a current improvement, investigation or future capability. Reuse an explicit owner decision instead of reopening it as a preference question.
2. Examine what supports the problem and proposed benefit. Separate observed behavior, owner testimony, user requests and a causal hypothesis. Ask what other explanation fits the evidence. Without a baseline, propose how to learn rather than claim growth or savings.
3. Choose a small usable slice that reaches a meaningful outcome. A form that prepares text and an inquiry that is actually received are different slices. Identify what must work end to end, exclusions and the dependency that could make the slice unusable. Let planner determine technical execution order.
4. Compare relevant alternatives, including improving the existing path, against supported value, risk, urgency and dependencies. Explain the tradeoff in words. Use numeric prioritization only when the inputs and method are real, not as a substitute for missing evidence. Do not classify a deliberately deferred capability as a current defect.
5. Define acceptance for the capability and a separate signal for the value assumption. State the user action, observable outcome and material failure/recovery. A bounded observation or reversible pilot can be more useful than an experiment requiring unavailable traffic. BI supplies the measure definition and baseline where available.
6. Hand BA the outcome, current/future boundary and unresolved business choice. Give designer the user problem, QA the acceptance intent and planner the approved slice. When work returns, compare actual behavior and available measures with both capability acceptance and the value hypothesis. Recommend accept, revise or investigate only within the evidence.

Keep the brief/backlog proposal proportionate: connect the outcome, slice, acceptance, reason for priority and the evidence gap that could change the decision. Maintain tasks through [repository-tasks](../repository-tasks/SKILL.md) when task records are in scope. Prioritization alone does not start implementation or spending.

# Cross-role handoffs

Save durable handoffs in the owning task under [repository-tasks](../../repository-tasks/SKILL.md). A handoff references its owning source and gives the receiver evidence to act. It is not an activity log or another plan.

## Assignment input

Coordinator supplies outcome/acceptance, absolute workspace and branch, role, owned files/read-only scope, upstream sources/revisions, accepted decisions, available tools/environment and allowed side effects. State receiver and expected evidence. Workers never delegate, mutate Git or call external integrations. Coordinator performs scoped authorized external actions.

## Return contract

- Outcome, artifact paths and source identity, including changed/dirty scope.
- Facts with sources/date, proposals and unknowns kept distinct.
- Acceptance/check evidence, failures and unavailable checks.
- Relevant human decisions with real source and reviewed revision.
- Receiver, usable result, remaining dependencies and next action.

Code/QA/review identify exact commit/build plus dirty/new scope. Documents/datasets identify revision/snapshot, coverage and definitions. Reassess evidence if its sources change. Receiver verifies a handoff instead of accepting the author's completion label.

## Responsibility and conflicts

One source owns each requirement, content fact, technical contract and measure. BA maintains requirements, content-manager factual copy, architect proposed technical decisions, BI definitions, coordinator plan/integration. Maintenance is not authority to invent facts or approve one's own business result.

Transfer shared-file ownership before edits by a different author. Correct requirements/content at their owner, then update affected code/tests. Defects return to the responsible author. Conflicting business rules/contracts go to coordinator with evidence and a proposed resolution. Do not silently change acceptance to match code.

## CTO decision packet

For a material open decision: question, scenario, options, recommendation/sources, consequences, dependent work and what can continue. Coordinator consolidates related questions. Record only a real answer and its scope. Do not re-approve an already authorized action. Business/quality/production facts come from their human owner through CTO/coordinator, not a made-up agent sign-off.

## Independence and completion

QA checks behavior, reviewer code/design, PO recommends business acceptance, CTO/named owner makes required human decisions. These do not substitute for each other. Same-agent role switching is not independent evidence. Missing runtime access is a stated gap, not a passed check or reason to stop unrelated work.

A bounded assignment ends with its agreed artifact, evidence and remaining gaps. Overall delivery follows dev-cycle and user scope. Handoff alone authorizes no publication, client contact, production operation, merge or closure.

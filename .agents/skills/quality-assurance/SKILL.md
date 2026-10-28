---
name: quality-assurance
description: >-
  Prepare and execute independent acceptance, exploratory, integration and regression checks for a specific build and allowed environment. Use for QA plans, behavior testing and defect verification, not code review alone.
---

# Quality assurance

Use the [qa contract](../../roles/qa.md). [build-and-test](../build-and-test/SKILL.md) owns executable commands and evidence.

## Establish the expected result

Identify acceptance, approved decisions, exact source/build, dirty/new scope, environment, integrations and permitted side effects. Another build's report is not current evidence. Derive the test oracle from requirements, business rules and contracts before comparing actual behavior. If the rule is unknown, identify the missing decision rather than copying the implementation into the expected result.

Distinguish the current approved buyer/manager process from a proposed target journey. Test the handoff and visible status the scoped release actually promises. A prepared cart, downloaded text or opened email is not a received request, confirmed order or payment.

## Select meaningful cases

Start with the highest-consequence changed behavior and its dependencies. Consider irreversible loss, access boundaries, money, wrong quantities and a blocked primary task before low-impact presentation differences. Scale coverage to the change. A small settled fix need not launch a complete commerce audit.

A useful case identifies the requirement, starting state and data, action, observable expected result and recovery when relevant. Choose positive, negative and recovery examples that can expose distinct failures. Include boundaries such as empty or unavailable data, duplicate action, cancellation, retry and restoration only where the affected behavior makes them meaningful. Do not mirror implementation branches or assert a toast when the actual requirement is a persisted operation.

Prepare separate synthetic data. Execute permitted local checks or author assigned tests. Live external checks go through the coordinator within authorization. A browser/API check that changes production records is not a read.

## Execute and diagnose

Observe the result at the boundary being claimed. For an integration, distinguish UI feedback, client request, service response, persisted state and downstream consumption as applicable. A mocked response supports the tested client contract, not real delivery, payment or reconciliation. Do not require every layer for a task whose acceptance stops earlier.

At the first unexpected transition, preserve the starting state and reproduction steps, compare expected with actual behavior and isolate the cause. Dependent checks remain unverified when progression is impossible. Continue unrelated scenarios rather than treating one unavailable prerequisite as failure of the whole assignment.

Use the result categories consistently:

- **Passed:** the observed result meets the established expectation on the identified build and boundary.
- **Failed:** an observed mismatch with that expectation. Include trigger, impact and reproduction evidence.
- **Blocked:** a named missing prerequisite or environment failure prevented execution.
- **Not run:** execution was not attempted. Give the reason when it affects readiness.

Keep unknown requirements, unavailable source facts and unproven integration behavior as explicit evidence gaps. They are neither passed checks nor automatically product defects. A real prerequisite may block a particular scenario without blocking independent local work.

## Verify the correction

Return defects with expected/actual behavior, consequence, exact identity and reproduction to the implementation owner. Recheck the originally failing case after integration and adjacent behavior exposed by the fix. Preserve valid prior evidence when its build and dependencies still apply. Report owned test-data cleanup and remaining gaps. QA does not silently patch implementation or lower acceptance to obtain a pass.

QA readiness advice does not grant release or business acceptance. Same-author checks are not independent QA. Code/design analysis stays with [reviewer](../../roles/reviewer.md).

For customer identity, order access, payments or personal data, apply [commerce security and data lifecycle](../architecture/references/commerce-security.md) to the affected boundaries.

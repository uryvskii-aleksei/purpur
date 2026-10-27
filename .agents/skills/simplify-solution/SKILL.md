---
name: simplify-solution
description: >-
  Simplify solutions and refactor code, including extraction of components, icons,
  types, hooks, selectors and utilities, and remove proven dead code. Use for
  упрости решение, simplify, cleanup, refactor, вынеси компонент, вынеси хук,
  extract from TSX, создай компонент or создай иконку. Preserve the requested scope.
---

# Simplify and refactor

Choose the operation:

| Request | Reference |
| --- | --- |
| Assess a proposed solution | [Solution design](references/solution-design.md) |
| Simplify existing structure | [Structural simplification](references/structural-simplification.md) |
| Create/extract components or icons | [Components and icons](../../../AGENTS.md#components-and-icons) |
| Extract types, hooks, selectors, constants or utilities | [Logic and API](../../../AGENTS.md#logic-and-api) |
| Remove unused code | [Dead code](references/dead-code.md) |

Preserve agreed behavior and public contracts. Reuse the smallest existing shared scope. Keep code inline when asked. Reassess only when new evidence changes the decision. After extraction, update callers, remove obsolete definitions/imports, verify through [build-and-test](../build-and-test/SKILL.md) and name relevant trade-offs.

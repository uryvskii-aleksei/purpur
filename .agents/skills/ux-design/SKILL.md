---
name: ux-design
description: >-
  Design responsive user journeys, interaction states and Purpur brand assets from requirements and verified content. Use for UX/UI specifications, prototypes and design handoffs, not backend implementation.
---

# UX and visual design

Apply the [designer contract](../../roles/designer.md). Start from the affected journey and existing design rather than a blank redesign.

## Frame the affected journey

Identify the visitor, intent, entry, decision, next action and observable completion. Read acceptance, the actual UI and verified content. Separate the current process from the requested target so a new self-service design does not silently erase a still-required handoff. Resolve only gaps that materially affect the assigned flow.

Use actual products, prices, pack labels, long text and missing data to judge hierarchy. Preserve Purpur's purple identity, existing tokens and verified photography. Check that content needed for a purchase decision remains findable. Preserve existing order restrictions for unconfirmed packaging. Mark other unknown commercial conditions instead of inventing values or implying that they are confirmed.

## Compare consequential compositions

When the choice changes hierarchy or the primary path, compare credible alternatives using the same content and tasks. Assess the visibility of the primary action, product facts, brand expression, reading order and cost in scrolling or attention. For example, an uncropped film may preserve the composition while making its details too small on a phone. Name that trade-off rather than calling one option universally better.

For a small change within an accepted composition, inspect the affected hierarchy directly. A heading and its lead sit above the picture and cards they introduce. A title trapped in one column beside the artwork is not a finished composition. Resting purple is one brand color. Hover and pressed are separate states of that color, not a second purple. Filled actions darken. Outline actions invert to a purple fill and white text. Catalog chips, filters and the grid keep one gap, and the search control shares the selects' bottom edge. In the cart, «Продолжить выбор» sits above checkout with a gap. The map button is not repeated as a link. The accepted concept interface in the [designer contract](../../roles/designer.md) is the shared source for navigation color, the video plate, cart feedback, selects, the product dialog and how a request leaves the page. New alternatives and user research are not mandatory for every edit. Separate aesthetic preference from observed task performance. A conversion claim requires relevant commercial evidence, not a mockup, agent preference or qualitative walkthrough.

## Specify states and interaction

Cover the relevant default, loading, empty, validation, error, success and recovery states. For each affected transition, make clear the initiating action, visible result, retained input and next available action. Do not require a full state matrix when the change affects only one settled state.

For forms and dialogs, specify the first focus, keyboard sequence, close/cancel behavior, focus return and error location. For async actions, show waiting and what happens after failure, retry or a lost result. Distinguish local preparation from a received request, confirmed order or payment. Use the owning business/integration contract to name success.

Specify responsive reading order, content wrapping, usable touch targets, text size and contrast. Account for keyboard navigation, text enlargement, screen-keyboard obstruction and reduced motion where affected. Media needs user control and an appropriate alternative for meaningful content. A desktop arrangement is not sufficient evidence for the mobile version.

## Inspect and hand off

Inspect relevant rendered states when preview is available, including a representative failure or recovery for changed interactions. Use task observations when they address the unresolved design question. Record what a screenshot, interactive walkthrough or buyer observation actually establishes. Unavailable rendering remains unverified.

Source copy/assets with content-manager. Give coder the layout, responsive rules, interaction/state behavior and unresolved decisions. Give QA observable acceptance cases, and marketing only the approved creative. Application-code authorship must be explicitly assigned if included. Without design integration, use an editable local specification or prototype. A supplied Figma reference follows [figma-to-code](../figma-to-code/SKILL.md).

Return editable design/specification, provenance, state behavior and checks. A design handoff does not independently launch product implementation or publication. When the CTO is reviewing the concept, local files are not the site they see. Publish the changed public files to the stand root as described in [operations](../operations/SKILL.md).

For native Figma creation or edits, select and verify capabilities through [corporate MCP selection](../integration-design/references/corporate-mcp.md). Keep task requirements and accepted decisions in Git, with design references and useful exports.

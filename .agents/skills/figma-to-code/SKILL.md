---
name: figma-to-code
description: >-
  Implement UI from Figma designs with the available Figma integration and the owning application stack. Triggers: верстай из Figma, по макету, из макета, figma.com URL, implement from Figma, Figma to code.
---

# Figma → Code

Use a supplied Figma file/node with a capability-verified integration under [corporate MCP selection](../integration-design/references/corporate-mcp.md). Do not assume the current server is read-only or write-capable from its name alone. Apply [UI conventions](../../../AGENTS.md#components-and-icons) and existing design-system components. Without a link/node or MCP access, report the missing input/integration.

1. Parse the file key/node ID. Convert URL hyphens to node colons.
2. Reuse session data. Otherwise inspect the supported integration schema and make one shallow design-data call per task, limiting large payloads. Do not fetch in parallel. Export only the assets needed for the authorized task, preserving provenance and design-system relationships.
3. Map layout to the existing HTML/CSS or component structure and theme tokens.
4. On 429, stop Figma calls, report `Retry-After` when available and continue only with cached data. No automatic retries or token rotation to evade per-user limits. See [Figma rate limits](https://developers.figma.com/docs/rest-api/rate-limits/).

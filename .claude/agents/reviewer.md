---
name: reviewer
model: "inherit"
tools: Read, Glob, Grep
disallowedTools: mcp__*, Agent, Task
permissionMode: plan
description: "Reviews supplied code diffs or research and design artifacts. Checks correctness, evidence, regressions and applicable project contracts. The coordinator supplies diff/full/artifact mode and scope."
---

Read and follow @.agents/roles/reviewer.md as the complete role contract.

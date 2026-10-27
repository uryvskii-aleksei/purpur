# States

Read the live WI and its type/project workflow first. Change states only within the authorized assignment. Feature states remain read-only and Impediment states stay human-managed. Use the exact available states. Never apply Task state names to PBIs or invent a generic PBI workflow.

## Implementation Tasks

The following names apply to scoped implementation Tasks in the example Scrum process, only if these exact states exist in the selected project. Resolve actual names and allowed transitions for other types/projects, including task-level Bugs and PBIs.

| State | Allowed use on scoped Tasks |
| --- | --- |
| `To Do` | New work |
| `In Progress` | Start commit and draft PR with the plan exist, implementation starting or resuming |
| `Blocked/On Hold` | A real dependency blocks progress |
| `On Review/Building for Test` | Finished work with a linked PR awaiting review |
| `Ready for Testing`, `In Test` | QA-managed, change only on explicit request |
| `Done` | PR merged and user requested/confirmed closure |
| `Removed` | Never |

Blocked work returns through In Progress before review. Partial delivery stays In Progress. Review fixes stay in review. If effort-field validation rejects a transition, set only the empty required field to 0 and retry. Leave fields that already have a value unchanged.

## Research PBIs and Spike Tasks

Use the actual type/project workflow for scoped research PBIs and Spike Tasks. Starting or resuming research does not depend on a start commit or draft PR. For research without repository changes, readiness follows the recorded question, evidence, conclusion and applicable human review under [research](../../design-and-docs/references/research.md), rather than a merged PR, CI or QA handoff.

Record the reviewed design revision and direct human decision source under [writing rules](links-and-writing.md#maintained-work-results). A workflow state never proves design approval. Readiness or approval does not authorize `Done` or equivalent closure. Close only on explicit human authorization and after checking the actual completion criteria. Do not close the research PBI or Spike Tasks automatically when handing off to a new implementation chat.

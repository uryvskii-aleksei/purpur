---
name: operations
description: >-
  Prepare deployment, CI, monitoring, backup/restore, access and incident runbooks for actual environments. Use for DevOps tasks. Proposals do not create services or production changes.
---

# Operations and DevOps

Use the [devops contract](../../roles/devops.md). Read the environment and scope before choosing tools.

1. Inventory the actual service/owner, [environment scope](../../../docs/techprojects/site-development/site-development.md), running version, deployment path and configuration/secret mechanisms. Distinguish the deployed artifact from a source checkout. Record the source/build identity and material inputs needed to reproduce or promote that artifact.
2. Compare the relevant environment properties: runtime/dependency versions, schema, configuration shape, identities, data and external endpoints. Explain intentional differences. Check outbound jobs/callbacks as well as inbound access when verifying isolation. Use synthetic data and actual secret mechanisms. Environment names alone do not prove separation.
3. For rollout, identify prerequisites and health signals for the affected behavior and dependencies, an observation window and stop/rollback conditions. Take thresholds from actual service objectives or make their absence explicit. A syntax check or process health response is only one layer of verification. Do not require a new deployment strategy or environment when the existing one suffices.
4. Establish application/data compatibility before treating rollback as executable. Check whether the previous application can read data written by the new version and whether a migration has irreversible effects. Describe when rollback, forward repair or external reconciliation is appropriate. Coordinate these contracts with architect/integration engineer.
5. For recovery, identify backup scope, retention, protection and restore dependencies, including attachments and required configuration. Restore into an isolated permitted target with outbound side effects contained. Verify the restored service can use the data and important relationships, not merely that restore exited successfully. Report measured recovery coverage and missing business recovery objectives without inventing tolerated loss/downtime.
6. For incidents, start from the affected behavior and time window. Compare recent artifact/configuration/dependency changes, separate observations from hypotheses and preserve redacted diagnostics. Prefer a small reversible mitigation with a way to detect improvement. Do not replay writes or restore data as a diagnostic shortcut.

Prepare only the applicable configuration/runbook and local checks. Coordinator executes authorized environment operations. Record what was actually exercised and what is still a proposed procedure. Keep credentials out of commands/logs that become repository artifacts.

The concept the CTO reviews is the host root `https://cj999935.tw1.ru/`. Local preview is `http://127.0.0.1:4173/concept/`. Styles and scripts on that host are cached for a year, so a visual change stays invisible until the HTML query on each changed file is new and those files are uploaded to the root. Do not store panel, FTP or mailbox passwords in Git. A concept edit the CTO asked to see is not delivered until that root serves it.

Route business impact to PO/CTO, shared boundaries to architect and adapters to integration engineer. Operational readiness, QA, business acceptance and release authorization differ. A general operational task does not authorize billing, public access, destructive cleanup or live restores.

For corporate Figma or Rocket.Chat access, apply [corporate MCP selection](../integration-design/references/corporate-mcp.md). Documented capability is not a verified connection, and curated tool sets can include writes.

For this project's macOS click failure or any proposed return to native desktop automation, read [desktop input isolation](references/desktop-input-incident.md). Preserve its active incident restriction across handoffs.

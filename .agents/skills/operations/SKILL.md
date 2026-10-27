---
name: operations
description: >-
  Prepare deployment, CI, monitoring, backup/restore, access and incident runbooks for actual environments. Use for DevOps tasks. Proposals do not create services or production changes.
---

# Operations and DevOps

Use the [devops contract](../../roles/devops.md). Read the environment and scope before choosing tools.

1. Identify service/owner, environment, source version, current deployment and configuration/secret mechanisms. Do not infer a production access right or expose secrets.
2. For deployment, define provenance, prerequisites, health checks, rollout/rollback and data compatibility. Code rollback may not reverse a migration.
3. For recovery, identify backup scope/retention/access, isolated restore procedure and actual restore evidence. Obtain missing business recovery objectives instead of inventing tolerated data loss or downtime.
4. For incidents, separate observation, hypothesis and confirmed cause. Start with scoped read-only evidence, preserve useful redacted diagnostics and propose a small reversible mitigation. Production action follows actual authorization.
5. Prepare assigned CI/config/runbooks and verify local syntax/behavior. Coordinator executes authorized live operations and checks the same version. Report inaccessible environment checks and untested recovery plainly.

Route business impact to PO/CTO, shared boundaries to architect and adapters to integration engineer. Operational readiness, QA, business acceptance and release authorization differ. A general operational task does not authorize billing, public access, destructive cleanup or live restores.
